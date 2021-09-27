import { BIP32, BIP44 } from "@payvo/cryptography";
import { Contracts, Exceptions, IoC, Services, Signatories } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32Interface } from "bitcoinjs-lib";
import coinSelect from "coinselect";

import { getNetworkConfig } from "./config";
import { BindingType } from "./constants";
import { addressesAndSigningKeysGenerator, SigningKeys } from "./transaction.domain";
import { AddressFactory, BipLevel, Levels } from "./address.factory";
import { Bip44Address, UnspentTransaction } from "./contracts";
import { getDerivationMethod, post } from "./helpers";
import { LedgerService } from "./ledger.service";
import { jest } from "@jest/globals";
import WalletDataHelper from "./wallet-data-helper";

jest.setTimeout(20_000);

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	@IoC.inject(IoC.BindingType.LedgerService)
	private readonly ledgerService!: LedgerService;

	@IoC.inject(BindingType.AddressFactory)
	private readonly addressFactory!: AddressFactory;

	@IoC.inject(IoC.BindingType.AddressService)
	private readonly addressService!: Services.AddressService;

	@IoC.inject(IoC.BindingType.FeeService)
	private readonly feeService!: Services.FeeService;

	@IoC.inject(BindingType.LedgerTransport)
	private readonly transport!: Services.LedgerTransport;

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (input.signatory.signingKey() === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "input.signatory");
		}

		if (!input.signatory.actsWithMnemonic() && !input.signatory.actsWithLedger()) {
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
		try {
			if (input.signatory.actsWithLedger()) {
				await this.ledgerService.connect(this.transport);
			}

			const bipLevel = this.addressFactory.getLevel(identityOptions);

			const network = getNetworkConfig(this.configRepository);

			// Compute the amount to be transferred
			const amount = this.toSatoshi(input.data.amount).toNumber();

			const accountKey = await this.#getAccountKey(input.signatory, network, bipLevel);

			const walledDataHelper = this.addressFactory.walletDataHelper(
				bipLevel,
				this.#toWalletIdentifier(accountKey, this.#addressingSchema(bipLevel)),
			);
			await walledDataHelper.discoverAllUsed();

			// Derive the sender address (corresponding to first address index for the wallet)
			const { address } = walledDataHelper.discoveredSpendAddresses()[0];

			const changeAddress = walledDataHelper.firstUnusedChangeAddress();

			const targets = [
				{
					address: input.data.to,
					value: amount,
				},
			];

			// Figure out inputs, outputs and fees
			const feeRate = await this.#getFeeRateFromNetwork(input);

			const { inputs, outputs, fee } = await this.#selectUtxos(
				bipLevel,
				accountKey,
				targets,
				feeRate,
				walledDataHelper,
			);

			let transaction: bitcoin.Transaction;

			outputs.forEach((output) => {
				if (!output.address) {
					output.address = changeAddress.address;
				}
			});

			if (input.signatory.actsWithMnemonic()) {
				transaction = await this.#createTransactionLocalSigning(network, inputs, outputs);
			} else if (input.signatory.actsWithLedger()) {
				transaction = await this.ledgerService.createTransaction(network, inputs, outputs, changeAddress);
			} else {
				throw new Exceptions.Exception("Unsupported signatory");
			}

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
		} finally {
			if (input.signatory.actsWithLedger()) {
				await this.ledgerService.disconnect();
			}
		}
	}

	async #createTransactionLocalSigning(
		network: bitcoin.networks.Network,
		inputs: any[],
		outputs: any[],
	): Promise<bitcoin.Transaction> {
		const psbt = new bitcoin.Psbt({ network });

		inputs.forEach((input) =>
			psbt.addInput({
				hash: input.txId,
				index: input.vout,
				...input,
			}),
		);
		outputs.forEach((output) =>
			psbt.addOutput({
				address: output.address,
				value: output.value,
			}),
		);

		// Sign and verify signatures
		inputs.forEach((input, index) =>
			psbt.signInput(index, bitcoin.ECPair.fromPrivateKey(input.signingKey, { network })),
		);

		if (!psbt.validateSignaturesOfAllInputs()) {
			throw new Exceptions.Exception("There was a problem signing the transaction locally.");
		}
		await psbt.finalizeAllInputs();

		return psbt.extractTransaction();
	}

	async #getAccountKey(
		signatory: Signatories.Signatory,
		network: bitcoin.networks.Network,
		bipLevel: Levels,
	): Promise<BIP32Interface> {
		if (signatory.actsWithMnemonic()) {
			return BIP32.fromMnemonic(signatory.signingKey(), network)
				.deriveHardened(bipLevel.purpose)
				.deriveHardened(bipLevel.coinType)
				.deriveHardened(bipLevel.account || 0);
		} else if (signatory.actsWithLedger()) {
			await this.ledgerService.connect(this.transport);
			try {
				const path = `m/${bipLevel.purpose}'/${bipLevel.coinType}'/${bipLevel.account || 0}'`;
				const publicKey = await this.ledgerService.getExtendedPublicKey(path);
				return BIP32.fromBase58(publicKey, network);
			} finally {
				await this.ledgerService.disconnect();
			}
		}
		throw new Exceptions.Exception("Invalid signatory");
	}

	async #selectUtxos(
		levels: Levels,
		accountKey,
		targets,
		feeRate: number,
		walledDataHelper: WalletDataHelper,
	): Promise<{ outputs: any[]; inputs: any[]; fee: number }> {
		const method = this.#addressingSchema(levels);
		const id = this.#toWalletIdentifier(accountKey, method);

		const allUnspentTransactionOutputs = await this.unspentTransactionOutputs(walledDataHelper.allUsedAddresses());

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
			const path: string[] = signingKey.path.split("/");
			return {
				address: utxo.address,
				txId: utxo.txId,
				txRaw: utxo.raw,
				script: utxo.script,
				vout: utxo.outputIndex,
				value: utxo.satoshis,
				signingKey: signingKey.privateKey ? Buffer.from(signingKey.privateKey, "hex") : undefined,
				publicKey: Buffer.from(signingKey.publicKey, "hex"),
				path: BIP44.stringify({
					...levels,
					change: parseInt(path[0]),
					index: parseInt(path[1]),
				}),
				...extra,
			};
		});

		const { inputs, outputs, fee } = coinSelect(utxos, targets, feeRate);

		if (!inputs || !outputs) {
			throw new Error("Cannot determine utxos for this transaction. Probably not enough founds.");
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

	async #getFeeRateFromNetwork(input: Services.TransferInput): Promise<number> {
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

	private async unspentTransactionOutputs(bip44Addresses: Bip44Address[]): Promise<UnspentTransaction[]> {
		const addresses = bip44Addresses.map((address) => address.address);

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
