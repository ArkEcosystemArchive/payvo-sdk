import { Contracts, Exceptions, Helpers, IoC, Services } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";
import coinSelect from "coinselect";

import { UnspentTransaction } from "./contracts";
import { UnspentAggregator } from "./unspent-aggregator";
import { getNetworkConfig } from "./config";
import { BindingType } from "./constants";
import { WalletIdentifier } from "@payvo/sdk/distribution/services";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	@IoC.inject(IoC.BindingType.AddressService)
	private readonly addressService!: Services.AddressService;

	@IoC.inject(BindingType.UnspentAggregator)
	private readonly unspent!: UnspentAggregator;

	@IoC.inject(IoC.BindingType.ExtendedPublicKeyService)
	private readonly extendedPublicKeyService!: Services.ExtendedPublicKeyService;

	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		try {
			if (input.signatory.signingKey() === undefined) {
				throw new Exceptions.MissingArgument(this.constructor.name, this.transfer.name, "input.signatory");
			}

			if (input.signatory.actsWithMnemonic()) {
				console.log(input.signatory.signingKey());
			}

			// 1. Derive the sender address (corresponding to first address index for the wallet)
			const { address, type, path } = await this.addressService.fromMnemonic(
				input.signatory.signingKey(),
				input.signatory.options(),
			);
			console.log(type, address, path);

			// 2. Aggregate the unspent transactions
			const xpub = await this.extendedPublicKeyService.fromMnemonic(
				input.signatory.signingKey(),
				input.signatory.options(),
			);

			// 3. Compute the amount to be transfered
			const amount = this.toSatoshi(input.data.amount).toNumber();

			const targets = [
				{
					address: input.data.to,
					value: amount,
				},
			];

			const psbt = new bitcoin.Psbt({ network: getNetworkConfig(this.configRepository) });

			await this.#addUtxos(
				psbt,
				{
					type: "extendedPublicKey",
					value: xpub,
					method: "bip44", // @TODO Get this based on the input.signatory.options() passed in
				},
				targets,
				address,
			);

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

	async #addUtxos(psbt, id: WalletIdentifier, targets, changeAddress): Promise<void> {
		const feeRate = 55; // satoshis per byte // @TODO Need to get this from endpoint

		const allUnspentTransactionOutputs = await this.unspent.aggregate(id);

		let utxos = allUnspentTransactionOutputs.map((utxo) => ({
			txId: utxo.txId,
			vout: utxo.outputIndex,
			value: utxo.satoshis,
			nonWitnessUtxo: Buffer.from(utxo.raw, 'hex'),
			// // OR
			// // if your utxo is a segwit output, you can use witnessUtxo instead
			// witnessUtxo: {
			// 	script: Buffer.from('... scriptPubkey hex...', 'hex'),
			// 	value: 10000 // 0.0001 BTC and is the exact same as the value above
			// }
		}));

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

		psbt.validateSignaturesOfAllInputs();
		psbt.finalizeAllInputs();
	}
}
