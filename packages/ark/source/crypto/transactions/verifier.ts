import { DuplicateParticipantInMultiSignatureError, InvalidMultiSignatureAssetError } from "../errors.js";
import { Hash } from "../hash";
import { IMultiSignatureAsset, ISchemaValidationResult, ITransactionData, IVerifyOptions } from "../interfaces";
import { configManager } from "../managers";
import { validator } from "../validation";
import { TransactionTypeFactory } from "./types/factory.js";
import { Utils } from "./utils.js";

export class Verifier {
	public static verify(data: ITransactionData, options?: IVerifyOptions): boolean {
		if (configManager.getMilestone().aip11 && !data.version) {
			return false;
		}

		return Verifier.verifyHash(data, options?.disableVersionCheck);
	}

	public static verifySecondSignature(
		transaction: ITransactionData,
		publicKey: string,
		options?: IVerifyOptions,
	): boolean {
		const secondSignature: string | undefined = transaction.secondSignature || transaction.signSignature;

		if (!secondSignature) {
			return false;
		}

		const hash: Buffer = Utils.toHash(transaction, {
			disableVersionCheck: options?.disableVersionCheck,
			excludeSecondSignature: true,
		});
		return this.internalVerifySignature(hash, secondSignature, publicKey);
	}

	public static verifySignatures(transaction: ITransactionData, multiSignature: IMultiSignatureAsset): boolean {
		if (!multiSignature) {
			throw new InvalidMultiSignatureAssetError();
		}

		const { publicKeys, min }: IMultiSignatureAsset = multiSignature;
		const { signatures }: ITransactionData = transaction;

		const hash: Buffer = Utils.toHash(transaction, {
			excludeMultiSignature: true,
			excludeSecondSignature: true,
			excludeSignature: true,
		});

		const publicKeyIndexes: { [index: number]: boolean } = {};
		let verified = false;
		let verifiedSignatures = 0;

		if (signatures) {
			for (let index = 0; index < signatures.length; index++) {
				const signature: string = signatures[index];
				const publicKeyIndex: number = Number.parseInt(signature.slice(0, 2), 16);

				if (!publicKeyIndexes[publicKeyIndex]) {
					publicKeyIndexes[publicKeyIndex] = true;
				} else {
					throw new DuplicateParticipantInMultiSignatureError();
				}

				const partialSignature: string = signature.slice(2, 130);
				const publicKey: string = publicKeys[publicKeyIndex];

				if (Hash.verifySchnorr(hash, partialSignature, publicKey)) {
					verifiedSignatures++;
				}

				if (verifiedSignatures === min) {
					verified = true;
					break;
				} else if (signatures.length - (index + 1 - verifiedSignatures) < min) {
					break;
				}
			}
		}

		return verified;
	}

	public static verifyHash(data: ITransactionData, disableVersionCheck = false): boolean {
		const { signature, senderPublicKey } = data;

		if (!signature || !senderPublicKey) {
			return false;
		}

		const hash: Buffer = Utils.toHash(data, {
			disableVersionCheck,
			excludeSecondSignature: true,
			excludeSignature: true,
		});

		return this.internalVerifySignature(hash, signature, senderPublicKey);
	}

	public static verifySchema(data: ITransactionData, strict = true): ISchemaValidationResult {
		const transactionType = TransactionTypeFactory.get(data.type, data.typeGroup, data.version);

		if (!transactionType) {
			throw new Error();
		}

		const { $id } = transactionType.getSchema();

		return validator.validate(strict ? `${$id}Strict` : `${$id}`, data);
	}

	private static internalVerifySignature(hash: Buffer, signature: string, publicKey: string): boolean {
		return Hash.verifySchnorr(hash, signature, publicKey);
	}
}
