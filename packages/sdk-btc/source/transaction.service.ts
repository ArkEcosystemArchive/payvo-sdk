import { BIP32 } from "@payvo/cryptography";
import { Contracts, Exceptions, IoC, Services, Signatories } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32Interface } from "bitcoinjs-lib";
import coinSelect from "coinselect";
import BtcApp from "@ledgerhq/hw-app-btc";

import { getNetworkConfig } from "./config";
import { BindingType } from "./constants";
import { addressesAndSigningKeysGenerator, SigningKeys } from "./transaction.domain";
import { AddressFactory, BipLevel, Levels } from "./address.factory";
import { UnspentTransaction } from "./contracts";
import { firstUnusedAddresses, getAddresses, getDerivationMethod, post } from "./helpers";
import { addressGenerator } from "./address.domain";
import { LedgerService } from "./ledger.service";
import { serializeTransaction as serializer } from "@ledgerhq/hw-app-btc/lib/serializeTransaction";
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";

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

		const bipLevel = this.addressFactory.getLevel(identityOptions);

		const network = getNetworkConfig(this.configRepository);

		// Derive the sender address (corresponding to first address index for the wallet)
		const { address, type, path } = await this.addressService.fromMnemonic(
			input.signatory.signingKey(),
			identityOptions,
		);

		// Compute the amount to be transferred
		const amount = this.toSatoshi(input.data.amount).toNumber();

		const accountKey = await this.#getAccountKey(input.signatory, network, bipLevel);

		const changeAddress = await this.#getChangeAddress(
			this.#toWalletIdentifier(accountKey, this.#addressingSchema(bipLevel)),
		);

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

		if (input.signatory.actsWithMnemonic()) {
			inputs.forEach((input, index) => (input.signer = bitcoin.ECPair.fromPrivateKey(input.signingKey)));
		} else {
			const splitTransaction = (ledger: BtcApp, tx: bitcoin.Transaction) =>
				ledger.splitTransaction(tx.toHex(), tx.hasWitnesses());

			// @ts-ignore
			const newTx: bitcoin.Transaction = psbt.__CACHE.__TX;
			console.log(newTx);

			// const outLedgerTx = splitTransaction(this.ledgerService.getTransport(), newTx);
			// const outputScriptHex = await serializer.serializeTransactionOutputs(outLedgerTx).toString("hex");
			// console.log("outLedgerTx", outLedgerTx);
			//
			inputs.forEach((input, index) => {
				const inLedgerTx = splitTransaction(this.ledgerService.getTransport(), input);
				input.signer = {
					network,
					publicKey: accountKey,
					sign: bitcoin.ECPair.fromPrivateKey(input.signingKey),
					// async ($hash: Buffer) => {
					// 	const ledgerTxSignatures = await ledger.signP2SHTransaction({
					// 		// @ts-ignore
					// 		inputs: [[inLedgerTx, txIndex, ledgerRedeemScript.toString("hex")]],
					// 		associatedKeysets: [path],
					// 		outputScriptHex,
					// 		lockTime: DEFAULT_LOCK_TIME,
					// 		segwit: newTx.hasWitnesses(),
					// 		transactionVersion: version,
					// 		sigHashType: SIGHASH_ALL,
					// 	});
					// 	const [ledgerSignature] = ledgerTxSignatures;
					// 	const finalSignature = (() => {
					// 		if (newTx.hasWitnesses()) {
					// 			return Buffer.from(ledgerSignature, "hex");
					// 		}
					// 		return Buffer.concat([
					// 			ledgerSignature,
					// 			Buffer.from("01", "hex"), // SIGHASH_ALL
					// 		]);
					// 	})();
					// 	console.log({
					// 		finalSignature: finalSignature.toString("hex"),
					// 	});
					// 	const { signature } = bitcoin.script.signature.decode(finalSignature);
					// 	return signature;
					// },
				};
			});
		}

		// Sign and verify signatures
		inputs.forEach((input, index) => psbt.signInput(index, input.signer));

		await psbt.validateSignaturesOfAllInputs();
		await psbt.finalizeAllInputs();

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
			// @ts-ignore
			await this.ledgerService.connect(LedgerTransportNodeHID.default);
			try {
				const path = `m/${bipLevel.purpose}'/${bipLevel.coinType}'/${bipLevel.account || 0}'`;
				const publicKey = await this.ledgerService.getPublicKey(path);
				let fromPublicKey1 = BIP32.fromPublicKey(Buffer.from(publicKey, "hex"), Buffer.from(""), network);
				console.log("path", path, "publicKey", publicKey, fromPublicKey1);
				return fromPublicKey1;
			} finally {
				await this.ledgerService.disconnect();
			}
		}
		throw new Exceptions.Exception("Invalid signatory");
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

		const derivationMethod = getDerivationMethod(id);

		console.log("allUnspentTransactionOutputs", allUnspentTransactionOutputs);

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
		return firstUnusedAddresses(
			addressGenerator(getDerivationMethod(id), getNetworkConfig(this.configRepository), id.value, false, 100),
			this.httpClient,
			this.configRepository,
		);
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
