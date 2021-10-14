// import { Transactions, Interfaces, Identities, Enums, Utils } from "@arkecosystem/crypto";
import { Contracts, Exceptions, IoC, Services, Signatories } from "@payvo/sdk";
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";

import { MultiSignatureAsset, MultiSignatureTransaction } from "./multi-signature.contract";
import { PendingMultiSignatureTransaction } from "./multi-signature.transaction";
import * as bitcoin from "bitcoinjs-lib";

@IoC.injectable()
export class MultiSignatureSigner {
	@IoC.inject(IoC.BindingType.LedgerService)
	private readonly ledgerService!: Services.LedgerService;

	@IoC.inject(IoC.BindingType.KeyPairService)
	private readonly keyPairService!: Services.KeyPairService;

	public sign(transaction: any, multiSignature: MultiSignatureAsset): MultiSignatureTransaction {
		if (transaction.data.type === Enums.TransactionType.MultiSignature && !transaction.signatures) {
			transaction.data.signatures = [];
		}

		const data =
			transaction.data.type === Enums.TransactionType.MultiSignature
				? transaction.getStruct()
				: transaction.build().toJson();

		data.multiSignature = multiSignature;

		if (!data.signatures) {
			data.signatures = [];
		}

		return data;
	}

	public async addSignature(
		transaction: Contracts.RawTransactionData,
		signatory: Signatories.Signatory,
	): Promise<MultiSignatureTransaction> {
		const pendingMultiSignature = new PendingMultiSignatureTransaction(transaction);

		const isReady = pendingMultiSignature.isMultiSignatureReady({ excludeFinal: true });

		if (!isReady) {
			if (signatory.actsWithLedger()) {
				throw new Exceptions.NotImplemented(this.constructor.name, "signing with ledger");

				// TODO figure out all the signing paths and make a single
				// call to ledger to sign them all
				// Figure out how to merge the signed transaction back to Psbt
				// const index: number = this.#publicKeyIndex(
				// 	transaction,
				// 	await this.ledgerService.getExtendedPublicKey(signatory.signingKey()),
				// );
				//
				// if (!transaction.signatures) {
				// 	transaction.signatures = [];
				// }

				// const signature: string = await this.#signWithLedger(transaction, signatory, true);
				// const signatureIndex: string = Utils.numberToHex(index === -1 ? transaction.signatures.length : index);
				//
				// transaction.signatures.push(`${signatureIndex}${signature}`);
			} else {
					const toBeSigned = bitcoin.Psbt.fromBase64(transaction.data);
					// Iterate the different transaction inputs
					for (let i = 0; i < toBeSigned.inputCount; i++) {
						// For each one, figure out the address / path
						// Derive musig private key and sign that input
						toBeSigned.signInput(i, this.#figureOutSigner(toBeSigned, i));
					}

					const signed = bitcoin.Psbt.fromBase64(transaction.data).combine(toBeSigned);

			}
		}

		if (isReady && pendingMultiSignature.needsFinalSignature()) {
			if (signingKeys) {
				// TODO Do proper signing with keys here. Beware signing keys could be the ledger account path
				Transactions.Signer.sign(transaction, signingKeys);
			}

			if (signatory.actsWithLedger()) {
				transaction.signature = await this.#signWithLedger(transaction, signatory);
			}

			transaction.id = Transactions.Utils.getId(transaction);
		}

		return transaction;
	}

	async #signWithLedger(
		transaction: MultiSignatureTransaction,
		signatory: Signatories.Signatory,
		excludeMultiSignature = false,
	): Promise<string> {
		await this.ledgerService.connect(LedgerTransportNodeHID);

		try {
			// TODO figure out how to sigh Psbt with Ledger
			throw new Exceptions.NotImplemented(this.constructor.name, "signing with ledger");
			// const signature = await this.ledgerService.signTransaction(
			// 	signatory.signingKey(),
			// 	Transactions.Serializer.getBytes(transaction, {
			// 		excludeSignature: true,
			// 		excludeSecondSignature: true,
			// 		excludeMultiSignature,
			// 	}),
			// );
			// return signature;
		} finally {
			await this.ledgerService.disconnect();
		}
	}

	#formatKeyPair(keyPair?: Services.KeyPairDataTransferObject): Interfaces.IKeyPair | undefined {
		if (keyPair) {
			return {
				publicKey: keyPair.publicKey,
				privateKey: keyPair.privateKey,
				compressed: true,
			};
		}

		return undefined;
	}

	#publicKeyIndex(transaction: Contracts.RawTransactionData, publicKey: string): number {
		const index: number = transaction.multiSignature.publicKeys.indexOf(publicKey);

		if (index === -1) {
			throw new Error(`The public key [${publicKey}] is not associated with this transaction.`);
		}

		return index;
	}
}
