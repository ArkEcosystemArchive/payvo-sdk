import { Contracts, Exceptions, IoC, Services } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32Interface } from "bitcoinjs-lib";
import coinSelect from "coinselect";
import { UnspentAggregator } from "./unspent-aggregator";
import { getNetworkConfig } from "./config";
import { BindingType } from "./constants";
import { BIP32 } from "@payvo/cryptography";
import { bip44, bip49, bip84 } from "./address.domain";
import { addressesAndSigningKeysGenerator } from "./transaction.domain";
import { AddressFactory, BipLevel, Levels } from "./address.factory";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	@IoC.inject(BindingType.AddressFactory)
	private readonly addressFactory!: AddressFactory;

	@IoC.inject(IoC.BindingType.AddressService)
	private readonly addressService!: Services.AddressService;

	@IoC.inject(BindingType.UnspentAggregator)
	private readonly unspent!: UnspentAggregator;

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		if (input.signatory.signingKey() === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "input.signatory");
		}

		const identityOptions = input.signatory.options();
		if (identityOptions === undefined) {
			throw new Exceptions.Exception("Invalid bip level requested. A valid level is required: bip44, bip49 or bip84");
		}

		if (identityOptions.bip44 === undefined && identityOptions.bip49 === undefined && identityOptions.bip84 === undefined) {
			throw new Exceptions.Exception("Invalid bip level requested. A valid level is required: bip44, bip49 or bip84");
		}

		const levels = this.addressFactory.getLevel(identityOptions);

		try {
			if (input.signatory.actsWithMnemonic()) {
				console.log(input.signatory.signingKey());
			}
			const network = getNetworkConfig(this.configRepository);

			// 1. Derive the sender address (corresponding to first address index for the wallet)
			const { address, type, path } = await this.addressService.fromMnemonic(
				input.signatory.signingKey(),
				identityOptions,
			);
			console.log(type, address, path);

			// 3. Compute the amount to be transferred
			const amount = this.toSatoshi(input.data.amount).toNumber();

			// 4. Add utxos
			const accountKey = BIP32.fromMnemonic(input.signatory.signingKey(), network)
				.deriveHardened(levels.purpose!)
				.deriveHardened(levels.coinType)
				.deriveHardened(levels.account || 0);

			console.log("accountKey", accountKey.toBase58(), accountKey.neutered().toBase58());

			const targets = [
				{
					address: input.data.to,
					value: amount,
				},
			];

			const psbt = new bitcoin.Psbt({ network: network });

			await this.#addUtxos(psbt, levels, accountKey, targets, address);

			const transaction: bitcoin.Transaction = psbt.extractTransaction();

			return this.dataTransferObjectService.signedTransaction(
				transaction.getId(),
				{
					sender: address,
					recipient: input.data.to,
					amount: amount,
					fee: psbt.getFee(),
					timestamp: new Date(), // TODO See if we have a proper timestamp inside the built transaction
				},
				transaction.toHex(),
			);
		} catch (error) {
			console.log(error);
			throw new Exceptions.CryptoException(error);
		}
	}

	async #addUtxos(psbt, levels: Levels, accountKey: BIP32Interface, targets, changeAddress): Promise<void> {
		const feeRate = 55; // satoshis per byte // @TODO Need to get this from endpoint
		const method = this.#addressingSchema(levels);
		const id: Services.WalletIdentifier = {
			type: "extendedPublicKey",
			value: accountKey.neutered().toBase58(),
			method: method,
		};

		const allUnspentTransactionOutputs = await this.unspent.aggregate(id);
		console.log("allUnspentTransactionOutputs", allUnspentTransactionOutputs);

		const derivationMethod = this.#derivationMethod(method);

		let utxos = allUnspentTransactionOutputs.map((utxo) => {
			let signingKeysGenerator = addressesAndSigningKeysGenerator(derivationMethod, accountKey);
			let signingKey: string | undefined = undefined;
			do {
				const addressAndSigningKey: { address: string; privateKey: string } = signingKeysGenerator.next().value;
				if (addressAndSigningKey.address === utxo.address) {
					signingKey = addressAndSigningKey.privateKey;
				}
			} while (signingKey === undefined);

			const extra =
				levels.purpose === 44
					? {
							nonWitnessUtxo: Buffer.from(utxo.raw, "hex"),
					  }
					: {
							witnessUtxo: {
								script: Buffer.from(utxo.script, "hex"),
								value: utxo.satoshis,
							},
					  };
			return {
				address: utxo.address,
				txId: utxo.txId,
				vout: utxo.outputIndex,
				value: utxo.satoshis,
				signingKey: Buffer.from(signingKey, "hex"),
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

		inputs.forEach((input) =>
			psbt.addInput({
				hash: input.txId,
				index: input.vout,
				nonWitnessUtxo: input.nonWitnessUtxo,
				// // OR (not both)
				// witnessUtxo: input.witnessUtxo,
			}),
		);
		outputs.forEach((output) => {
			// watch out, outputs may have been added that you need to provide
			// an output address/script for
			if (!output.address) {
				output.address = changeAddress; // @TODO Derive and use fresh change addresses wallet.getChangeAddress()
				// wallet.nextChangeAddress()
			}

			psbt.addOutput({
				address: output.address,
				value: output.value,
			});
		});

		inputs.forEach((input, index) => psbt.signInput(index, bitcoin.ECPair.fromPrivateKey(input.signingKey)));

		psbt.validateSignaturesOfAllInputs();
		psbt.finalizeAllInputs();
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

	#derivationMethod(bipLevel: BipLevel): (publicKey: string, network: string) => string {
		return { bip44, bip49, bip84 }[bipLevel];
	}
}
