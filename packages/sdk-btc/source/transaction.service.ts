import { Contracts, Exceptions, Helpers, IoC, Services } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";

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

			// 1. Derive the sender address
			// const { address, type, path } = await this.addressService.fromMnemonic(input.signatory.signingKey(), input.signatory.options());
			// console.log(type, address, path);

			// 2. Aggregate the unspent transactions
			const xpub = await this.extendedPublicKeyService.fromMnemonic(input.signatory.signingKey(), input.signatory.options());
			const unspent: UnspentTransaction[] = await this.#figureOutUtxos({
				type: "extendedPublicKey",
				value: xpub,
				method: "bip44",
			});
			console.log("unspent", unspent);

			// 3. Compute the amount to be transfered
			const amount = this.toSatoshi(input.data.amount).toNumber();

			// 4. Build and sign the transaction
			const alice = bitcoin.ECPair.fromWIF("L2uPYXe17xSTqbCjZvL2DsyXPCbXspvcu5mHLDYUgzdUbZGSKrSr");
			const psbt = new bitcoin.Psbt({ network: getNetworkConfig(this.configRepository) });
			psbt.setVersion(2); // These are defaults. This line is not needed.
			psbt.setLocktime(0); // These are defaults. This line is not needed.
			psbt.addInput({
				// if hash is string, txid, if hash is Buffer, is reversed compared to txid
				hash: "7d067b4a697a09d2c3cff7d4d9506c9955e93bff41bf82d439da7d030382bc3e",
				index: 0,
				sequence: 0xffffffff, // These are defaults. This line is not needed.

				// non-segwit inputs now require passing the whole previous tx as Buffer
				nonWitnessUtxo: Buffer.from(
					"0200000001f9f34e95b9d5c8abcd20fc5bd4a825d1517be62f0f775e5f36da944d9" +
						"452e550000000006b483045022100c86e9a111afc90f64b4904bd609e9eaed80d48" +
						"ca17c162b1aca0a788ac3526f002207bb79b60d4fc6526329bf18a77135dc566020" +
						"9e761da46e1c2f1152ec013215801210211755115eabf846720f5cb18f248666fec" +
						"631e5e1e66009ce3710ceea5b1ad13ffffffff01" +
						// value in satoshis (Int64LE) = 0x015f90 = 90000
						"905f010000000000" +
						// scriptPubkey length
						"19" +
						// scriptPubkey
						"76a9148bbc95d2709c71607c60ee3f097c1217482f518d88ac" +
						// locktime
						"00000000",
					"hex",
				),
			});
			psbt.addOutput({
				address: "1KRMKfeZcmosxALVYESdPNez1AP1mEtywp",
				value: 80000,
			});
			psbt.signInput(0, alice);
			psbt.validateSignaturesOfInput(0);
			psbt.finalizeAllInputs();

			const transaction: bitcoin.Transaction = psbt.extractTransaction();

			return this.dataTransferObjectService.signedTransaction(
				transaction.getId(),
				{
					sender: input.signatory.publicKey(),
					recipient: input.data.to,
					amount: amount,
					fee: psbt.getFee(),
					timestamp: psbt.locktime, // TODO I don't think this is the right one
				},
				transaction.toHex(),
			);
		} catch (error) {
			console.log(error);
			throw new Exceptions.CryptoException(error);
		}
	}

	async #figureOutUtxos(id: WalletIdentifier): Promise<UnspentTransaction[]> {
		return await this.unspent.aggregate(id);
	}
}
