import { BigNumber, ByteBuffer } from "@payvo/sdk-helpers";

import { DuplicateParticipantInMultiSignatureError, InvalidTransactionBytesError } from "../errors.js";
import { IDeserializeOptions, ITransaction, ITransactionData } from "../interfaces/index.js";
import { TransactionTypeFactory } from "./types/index.js";

export class Deserializer {
	public static deserialize(serialized: string | Buffer, options: IDeserializeOptions = {}): ITransaction {
		const data = {} as ITransactionData;

		const buf: ByteBuffer = this.getByteBuffer(serialized);
		this.deserializeCommon(data, buf);

		const instance: ITransaction = TransactionTypeFactory.create(data);
		this.deserializeVendorField(instance, buf);

		// Deserialize type specific parts
		instance.deserialize(buf);

		this.deserializeSchnorrOrECDSA(data, buf);

		instance.serialized = buf.getResult();

		return instance;
	}

	public static deserializeCommon(transaction: ITransactionData, buf: ByteBuffer): void {
		buf.jump(1); // Skip 0xFF marker
		transaction.version = buf.readUInt8();
		transaction.network = buf.readUInt8();
		transaction.typeGroup = buf.readUInt32LE();
		transaction.type = buf.readUInt16LE();
		transaction.nonce = BigNumber.make(buf.readBigUInt64LE());

		transaction.senderPublicKey = buf.readBuffer(33).toString("hex");
		transaction.fee = BigNumber.make(buf.readBigUInt64LE().toString());
		transaction.amount = BigNumber.ZERO;
	}

	private static deserializeVendorField(transaction: ITransaction, buf: ByteBuffer): void {
		const vendorFieldLength: number = buf.readUInt8();
		if (vendorFieldLength > 0) {
			if (transaction.hasVendorField()) {
				const vendorFieldBuffer: Buffer = buf.readBuffer(vendorFieldLength);
				transaction.data.vendorField = vendorFieldBuffer.toString("utf8");
			} else {
				buf.jump(vendorFieldLength);
			}
		}
	}

	private static deserializeSchnorrOrECDSA(transaction: ITransactionData, buf: ByteBuffer): void {
		if (this.detectSchnorr(buf)) {
			this.deserializeSchnorr(transaction, buf);
		} else {
			this.deserializeECDSA(transaction, buf);
		}
	}

	private static deserializeECDSA(transaction: ITransactionData, buf: ByteBuffer): void {
		const currentSignatureLength = (): number => {
			buf.jump(1);
			const length = buf.readUInt8();

			buf.jump(-2);
			return length + 2;
		};

		// Signature
		if (buf.getRemainderLength()) {
			const signatureLength: number = currentSignatureLength();
			transaction.signature = buf.readBuffer(signatureLength).toString("hex");
		}

		const beginningMultiSignature = () => {
			const marker: number = buf.readUInt8();

			buf.jump(-1);

			return marker === 255;
		};

		// Second Signature
		if (buf.getRemainderLength() && !beginningMultiSignature()) {
			const secondSignatureLength: number = currentSignatureLength();
			transaction.secondSignature = buf.readBuffer(secondSignatureLength).toString("hex");
		}

		// Multi Signatures
		if (buf.getRemainderLength() && beginningMultiSignature()) {
			buf.jump(1);
			const multiSignature: string = buf.readBuffer(buf.getRemainderLength()).toString("hex");
			transaction.signatures = [multiSignature];
		}

		if (buf.getRemainderLength()) {
			throw new InvalidTransactionBytesError("signature buffer not exhausted");
		}
	}

	private static deserializeSchnorr(transaction: ITransactionData, buf: ByteBuffer): void {
		const canReadNonMultiSignature = () =>
			buf.getRemainderLength() && (buf.getRemainderLength() % 64 === 0 || buf.getRemainderLength() % 65 !== 0);

		if (canReadNonMultiSignature()) {
			transaction.signature = buf.readBuffer(64).toString("hex");
		}

		if (canReadNonMultiSignature()) {
			transaction.secondSignature = buf.readBuffer(64).toString("hex");
		}

		if (buf.getRemainderLength()) {
			if (buf.getRemainderLength() % 65 === 0) {
				transaction.signatures = [];

				const count: number = buf.getRemainderLength() / 65;
				const publicKeyIndexes: { [index: number]: boolean } = {};
				for (let i = 0; i < count; i++) {
					const multiSignaturePart: string = buf.readBuffer(65).toString("hex");
					const publicKeyIndex: number = Number.parseInt(multiSignaturePart.slice(0, 2), 16);

					if (!publicKeyIndexes[publicKeyIndex]) {
						publicKeyIndexes[publicKeyIndex] = true;
					} else {
						throw new DuplicateParticipantInMultiSignatureError();
					}

					transaction.signatures.push(multiSignaturePart);
				}
			} else {
				throw new InvalidTransactionBytesError("signature buffer not exhausted");
			}
		}
	}

	private static detectSchnorr(buf: ByteBuffer): boolean {
		const remaining: number = buf.getRemainderLength();

		// `signature` / `secondSignature`
		if (remaining === 64 || remaining === 128) {
			return true;
		}

		// `signatures` of a multi signature transaction (type != 4)
		if (remaining % 65 === 0) {
			return true;
		}

		// only possiblity left is a type 4 transaction with and without a `secondSignature`.
		if ((remaining - 64) % 65 === 0 || (remaining - 128) % 65 === 0) {
			return true;
		}

		return false;
	}

	private static getByteBuffer(serialized: Buffer | string): ByteBuffer {
		if (!(serialized instanceof Buffer)) {
			serialized = Buffer.from(serialized, "hex");
		}

		return new ByteBuffer(serialized);
	}
}
