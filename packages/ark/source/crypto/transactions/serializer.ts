import { ByteBuffer } from "../crypto/buffer.js";

import { TransactionTypeGroup } from "../enums.js";
import { TransactionVersionError } from "../errors.js";
import { ISerializeOptions, ITransaction, ITransactionData } from "../interfaces/index.js";
import { configManager } from "../managers/config.js";
import { isSupportedTransactionVersion } from "../utils.js";
import { TransactionTypeFactory } from "./types/factory.js";

// Reference: https://github.com/ArkEcosystem/AIPs/blob/master/AIPS/aip-11.md
export class Serializer {
	public static getBytes(transaction: ITransactionData, options: ISerializeOptions = {}): Buffer {
		const version: number = transaction.version || 2;

		if (options.acceptLegacyVersion || options.disableVersionCheck || isSupportedTransactionVersion(version)) {
			return this.serialize(TransactionTypeFactory.create(transaction), options);
		} else {
			throw new TransactionVersionError(version);
		}
	}

	/**
	 * Serializes the given transaction according to AIP11.
	 */
	public static serialize(transaction: ITransaction, options: ISerializeOptions = {}): Buffer {
		const buffer: ByteBuffer = new ByteBuffer(512);

		this.serializeCommon(transaction.data, buffer);
		this.serializeVendorField(transaction, buffer);

		const serialized: ByteBuffer | undefined = transaction.serialize(options);

		if (!serialized) {
			throw new Error();
		}

		const typeBuffer: ByteBuffer = serialized.flip();
		buffer.append(typeBuffer.toBuffer());

		this.serializeSignatures(transaction.data, buffer, options);

		const flippedBuffer: Buffer = buffer.flip().toBuffer();
		transaction.serialized = flippedBuffer;

		return flippedBuffer;
	}

	private static serializeCommon(transaction: ITransactionData, buffer: ByteBuffer): void {
		transaction.version = transaction.version || 0x01;
		if (transaction.typeGroup === undefined) {
			transaction.typeGroup = TransactionTypeGroup.Core;
		}

		console.log(buffer.toBuffer().byteLength);

		buffer.writeByte(0xff);
		buffer.writeByte(transaction.version);
		buffer.writeByte(transaction.network || configManager.get("network.pubKeyHash"));
		buffer.writeUint32(transaction.typeGroup);
		buffer.writeUint16(transaction.type);

		if (transaction.nonce) {
			buffer.writeUint64(transaction.nonce.toString());
		}

		if (transaction.senderPublicKey) {
			buffer.append(transaction.senderPublicKey, "hex");
		}

		buffer.writeUint64(transaction.fee.toString());
	}

	private static serializeVendorField(transaction: ITransaction, buffer: ByteBuffer): void {
		if (transaction.hasVendorField()) {
			const { data }: ITransaction = transaction;

			if (data.vendorField) {
				const vf: Buffer = Buffer.from(data.vendorField, "utf8");
				buffer.writeByte(vf.length);
				buffer.append(vf);
			} else {
				buffer.writeByte(0x00);
			}
		} else {
			buffer.writeByte(0x00);
		}
	}

	private static serializeSignatures(
		transaction: ITransactionData,
		buffer: ByteBuffer,
		options: ISerializeOptions = {},
	): void {
		if (transaction.signature && !options.excludeSignature) {
			buffer.append(transaction.signature, "hex");
		}

		const secondSignature: string | undefined = transaction.secondSignature || transaction.signSignature;

		if (secondSignature && !options.excludeSecondSignature) {
			buffer.append(secondSignature, "hex");
		}

		if (transaction.signatures && !options.excludeMultiSignature) {
			buffer.append(transaction.signatures.join(""), "hex");
		}
	}
}
