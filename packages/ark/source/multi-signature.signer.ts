import { Contracts, IoC, Services, Signatories } from "@payvo/sdk";
import { numberToHex, uniq } from "@payvo/sdk-helpers";

import { BindingType } from "./coin.contract.js";
import { Enums, Identities, Interfaces, Managers, Transactions } from "./crypto/index.js";
import { MultiSignatureAsset, MultiSignatureTransaction } from "./multi-signature.contract.js";
import { PendingMultiSignatureTransaction } from "./multi-signature.transaction.js";

export class MultiSignatureSigner {
	readonly #ledgerService!: Services.LedgerService;
	readonly #keyPairService!: Services.KeyPairService;

	public constructor(container: IoC.IContainer) {
		this.#ledgerService = container.get(IoC.BindingType.LedgerService);
		this.#keyPairService = container.get(IoC.BindingType.KeyPairService);

		Managers.configManager.setConfig(container.get(BindingType.Crypto));
		Managers.configManager.setHeight(container.get(BindingType.Height));
	}

	// The first argument should be a TransactionBuilder but we have no proper type to hint that.
	public sign(transaction: any, multiSignature: MultiSignatureAsset): MultiSignatureTransaction {
		if (transaction.data.type === Enums.TransactionType.MultiSignature && !transaction.signatures) {
			transaction.data.signatures = [];
		}

		if (!transaction.data.senderPublicKey) {
			transaction.senderPublicKey(Identities.PublicKey.fromMultiSignatureAsset(multiSignature));
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

		const { signingKeys, confirmKeys } = await this.#deriveKeyPairs(
			signatory,
			isReady && pendingMultiSignature.needsFinalSignature(),
		);

		if (!isReady) {
			if (signatory.actsWithLedger()) {
				const index: number = this.#publicKeyIndex(
					transaction,
					await this.#ledgerService.getPublicKey(signatory.signingKey()),
				);

				if (!transaction.signatures) {
					transaction.signatures = [];
				}

				const signature: string = await this.#signWithLedger(transaction, signatory, true);
				const signatureIndex: string = numberToHex(index === -1 ? transaction.signatures.length : index);

				transaction.signatures.push(`${signatureIndex}${signature}`);
			} else {
				if (!signingKeys) {
					throw new Error("Failed to retrieve the signing keys for the signatory wallet.");
				}

				Transactions.Signer.multiSign(
					transaction,
					signingKeys,
					this.#publicKeyIndex(transaction, signingKeys.publicKey),
				);
			}
		}

		if (isReady && pendingMultiSignature.needsFinalSignature()) {
			if (signingKeys) {
				Transactions.Signer.sign(transaction, signingKeys);
			}

			if (confirmKeys) {
				Transactions.Signer.secondSign(transaction, confirmKeys);
			}

			if (signatory.actsWithLedger()) {
				transaction.signature = await this.#signWithLedger(transaction, signatory);
			}

			transaction.id = Transactions.Utils.getId(transaction);
		}

		transaction.signatures = uniq(transaction.signatures);

		return transaction;
	}

	async #deriveKeyPairs(
		signatory: Signatories.Signatory,
		needsFinalSignature: boolean,
	): Promise<{
		signingKeys: Interfaces.IKeyPair | undefined;
		confirmKeys: Interfaces.IKeyPair | undefined;
	}> {
		let signingKeys: any;
		let confirmKeys: any;

		if (signatory.actsWithLedger()) {
			return { confirmKeys, signingKeys };
		}

		if (signatory.actsWithSecret()) {
			signingKeys = await this.#keyPairService.fromSecret(signatory.signingKey());
		}

		if (signatory.actsWithMnemonic()) {
			signingKeys = await this.#keyPairService.fromMnemonic(signatory.signingKey());
		}

		if (signatory.actsWithConfirmationMnemonic()) {
			signingKeys = await this.#keyPairService.fromMnemonic(signatory.signingKey());

			if (needsFinalSignature) {
				confirmKeys = await this.#keyPairService.fromMnemonic(signatory.confirmKey());
			}
		}

		if (signatory.actsWithWIF()) {
			signingKeys = await this.#keyPairService.fromWIF(signatory.signingKey());
		}

		if (signatory.actsWithConfirmationWIF()) {
			signingKeys = await this.#keyPairService.fromWIF(signatory.signingKey());
			confirmKeys = await this.#keyPairService.fromWIF(signatory.confirmKey());
		}

		if (!signingKeys) {
			throw new Error("Failed to retrieve the signing keys for the signatory wallet.");
		}

		return {
			confirmKeys: this.#formatKeyPair(confirmKeys),
			signingKeys: this.#formatKeyPair(signingKeys),
		};
	}

	async #signWithLedger(
		transaction: MultiSignatureTransaction,
		signatory: Signatories.Signatory,
		excludeMultiSignature = false,
	): Promise<string> {
		await this.#ledgerService.connect();

		const signature = await this.#ledgerService.signTransaction(
			signatory.signingKey(),
			// @ts-ignore
			Transactions.Serializer.getBytes(transaction, {
				excludeMultiSignature,
				excludeSecondSignature: true,
				excludeSignature: true,
			}),
		);

		await this.#ledgerService.disconnect();

		return signature;
	}

	#formatKeyPair(keyPair?: Services.KeyPairDataTransferObject): Interfaces.IKeyPair | undefined {
		if (keyPair) {
			return {
				compressed: true,
				privateKey: keyPair.privateKey,
				publicKey: keyPair.publicKey,
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
