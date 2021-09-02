import { BIP32 } from "@payvo/cryptography";
import { Contracts, Exceptions, IoC, Services } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32Interface } from "bitcoinjs-lib";
import coinSelect from "coinselect";

import { getNetworkConfig } from "./config";
import { BindingType } from "./constants";
import { addressesAndSigningKeysGenerator, SigningKeys } from "./transaction.domain";
import { AddressFactory, BipLevel, Levels } from "./address.factory";
import { UnspentTransaction } from "./contracts";
import { firstUnusedAddresses, getAddresses, getDerivationMethod, post } from "./helpers";
import { addressGenerator } from "./address.domain";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	@IoC.inject(BindingType.AddressFactory)
	private readonly addressFactory!: AddressFactory;

	@IoC.inject(IoC.BindingType.AddressService)
	private readonly addressService!: Services.AddressService;

	@IoC.inject(IoC.BindingType.FeeService)
	private readonly feeService!: Services.FeeService;

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (input.signatory.signingKey() === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "input.signatory");
		}

		if (!input.signatory.actsWithMnemonic()) {
			// @TODO Add more options (wif, ledger, extended private key, etc.).
			throw new Exceptions.Exception("Need to provide a signatory that can be used for signing transactions.");
		}

		const identityOptions = input.signatory.options();
		if (identityOptions === undefined) {
			throw new Exceptions.Exception(
				"Invalid bip level requested. A valid level is required: bip44, bip49 or bip84",
			);
		}

		if (
			identityOptions.bip44 === undefined &&
			identityOptions.bip49 === undefined &&
			identityOptions.bip84 === undefined
		) {
			throw new Exceptions.Exception(
				"Invalid bip level requested. A valid level is required: bip44, bip49 or bip84",
			);
		}

		const bipLevel = this.addressFactory.getLevel(identityOptions);

		try {
			const network = getNetworkConfig(this.configRepository);

			// Derive the sender address (corresponding to first address index for the wallet)
			const { address, type, path } = await this.addressService.fromMnemonic(
				input.signatory.signingKey(),
				identityOptions,
			);

			// Compute the amount to be transferred
			const amount = this.toSatoshi(input.data.amount).toNumber();

			const accountKey = BIP32.fromMnemonic(input.signatory.signingKey(), network)
				.deriveHardened(bipLevel.purpose)
				.deriveHardened(bipLevel.coinType)
				.deriveHardened(bipLevel.account || 0);

			const changeAddress = await this.#getChangeAddress(this.#toWalletIdentifier(accountKey, this.#addressingSchema(bipLevel)));

			const targets = [
				{
					address: input.data.to,
					value: amount,
				},
			];

			// Figure out inputs, outputs and fees
			const { inputs, outputs, fee } = await this.#selectUtxos(
				bipLevel,
				accountKey,
				targets,
				await this.#getFee(input),
			);

			// Build bitcoin transaction
			const psbt = new bitcoin.Psbt({ network: network });

			inputs.forEach((input) => {
				return psbt.addInput({
					hash: input.txId,
					index: input.vout,
					...input,
				});
			});
			outputs.forEach((output) => {
				if (!output.address) {
					output.address = changeAddress;
				}

				psbt.addOutput({
					address: output.address,
					value: output.value,
				});
			});

			inputs.forEach((input, index) => psbt.signInput(index, bitcoin.ECPair.fromPrivateKey(input.signingKey)));

			psbt.validateSignaturesOfAllInputs();
			psbt.finalizeAllInputs();

			const transaction: bitcoin.Transaction = psbt.extractTransaction();

			return this.dataTransferObjectService.signedTransaction(
				transaction.getId(),
				{
					sender: address,
					recipient: input.data.to,
					amount,
					fee,
					timestamp: new Date(),
				},
				transaction.toHex(),
			);
		} catch (error) {
			console.log(error);
			throw new Exceptions.CryptoException(error as any);
		}
	}

	async #selectUtxos(
		levels: Levels,
		accountKey: BIP32Interface,
		targets,
		feeRate: number,
	): Promise<{ outputs: any[]; inputs: any[]; fee: number }> {
		const method = this.#addressingSchema(levels);
		const id = this.#toWalletIdentifier(accountKey, method);

		const allUnspentTransactionOutputs = await this.unspentTransactionOutputs(id);
		console.log("allUnspentTransactionOutputs", allUnspentTransactionOutputs);

		const derivationMethod = getDerivationMethod(id);

		let utxos = allUnspentTransactionOutputs.map((utxo) => {
			let signingKeysGenerator = addressesAndSigningKeysGenerator(derivationMethod, accountKey);
			let signingKey: SigningKeys | undefined = undefined;

			do {
				const addressAndSigningKey: SigningKeys = signingKeysGenerator.next().value;
				if (addressAndSigningKey.address === utxo.address) {
					signingKey = addressAndSigningKey;
				}
			} while (signingKey === undefined);

			let extra;
			if (levels.purpose === 44) {
				extra = {
					nonWitnessUtxo: Buffer.from(utxo.raw, "hex"),
				};
			} else if (levels.purpose === 49) {
				let network = getNetworkConfig(this.configRepository);

				const payment = bitcoin.payments.p2sh({
					redeem: bitcoin.payments.p2wpkh({
						pubkey: Buffer.from(signingKey.publicKey, "hex"),
						network,
					}),
					network,
				});

				if (!payment.redeem) {
					throw new Error("The [payment.redeem] property is empty. This looks like a bug.");
				}

				extra = {
					witnessUtxo: {
						script: Buffer.from(utxo.script, "hex"),
						value: utxo.satoshis,
					},
					redeemScript: payment.redeem.output,
				};
			} else if (levels.purpose === 84) {
				extra = {
					witnessUtxo: {
						script: Buffer.from(utxo.script, "hex"),
						value: utxo.satoshis,
					},
				};
			}

			return {
				address: utxo.address,
				txId: utxo.txId,
				vout: utxo.outputIndex,
				value: utxo.satoshis,
				signingKey: Buffer.from(signingKey.privateKey, "hex"),
				...extra,
			};
		});

		const { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);
		console.log("inputs", inputs);
		console.log("outputs", outputs);
		console.log("fee", fee);

		if (!inputs || !outputs) {
			throw new Error("Cannot determine utxos for this transaction");
		}

		return { inputs, outputs, fee };
	}

	#toWalletIdentifier(accountKey, method: "bip44" | "bip49" | "bip84"): Services.WalletIdentifier {
		return {
			type: "extendedPublicKey",
			value: accountKey.neutered().toBase58(),
			method: method,
		};
	}

	async #getChangeAddress(id: Services.WalletIdentifier): Promise<string> {
		const network = getNetworkConfig(this.configRepository);

		return await firstUnusedAddresses(
			addressGenerator(getDerivationMethod(id), network, id.value, false, 100),
			this.httpClient,
			this.configRepository);
	}

	async #getFee(input: Services.TransferInput): Promise<number> {
		let feeRate: number | undefined = input.fee;

		if (!feeRate) {
			feeRate = (await this.feeService.all()).transfer.avg.toNumber();
		}
		return feeRate;
	}

	#addressingSchema(levels: Levels): BipLevel {
		if (levels.purpose === 44) {
			return "bip44";
		}

		if (levels.purpose === 49) {
			return "bip49";
		}

		if (levels.purpose === 84) {
			return "bip84";
		}

		throw new Exceptions.Exception(`Invalid level specified: ${levels.purpose}`);
	}

	private async unspentTransactionOutputs(id: Services.WalletIdentifier): Promise<UnspentTransaction[]> {
		const addresses = await getAddresses(id, this.httpClient, this.configRepository);

		const utxos = (
			await post(`wallets/transactions/unspent`, { addresses }, this.httpClient, this.configRepository)
		).data;

		const rawTxs = (
			await post(
				`wallets/transactions/raw`,
				{ transaction_ids: utxos.map((utxo) => utxo.txId) },
				this.httpClient,
				this.configRepository,
			)
		).data;

		return utxos.map((utxo) => ({
			...utxo,
			raw: rawTxs[utxo.txId],
		}));
	}
}
