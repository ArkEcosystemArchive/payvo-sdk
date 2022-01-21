import { ByteBuffer } from "@payvo/sdk-helpers";

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
		const buf: ByteBuffer = new ByteBuffer(
			Buffer.alloc(configManager.getMilestone(configManager.getHeight()).block?.maxPayload ?? 8192),
		);

		this.serializeCommon(transaction.data, buf);
		this.serializeVendorField(transaction, buf);

		const serialized: ByteBuffer | undefined = transaction.serialize(options);

		if (!serialized) {
			throw new Error();
		}

		buf.writeBuffer(serialized.getResult());

		this.serializeSignatures(transaction.data, buf, options);

		const serializedBuffer = buf.getResult();
		transaction.serialized = serializedBuffer;

		return serializedBuffer;
	}

	private static serializeCommon(transaction: ITransactionData, buf: ByteBuffer): void {
		transaction.version = transaction.version || 0x01;
		if (transaction.typeGroup === undefined) {
			transaction.typeGroup = TransactionTypeGroup.Core;
		}

		buf.writeUInt8(0xff);
		buf.writeUInt8(transaction.version);
		buf.writeUInt8(transaction.network || configManager.get("network.pubKeyHash"));
		buf.writeUInt32LE(transaction.typeGroup);
		buf.writeUInt16LE(transaction.type);

		if (transaction.nonce) {
			buf.writeBigInt64LE(transaction.nonce.toBigInt());
		}

		if (transaction.senderPublicKey) {
			buf.writeBuffer(Buffer.from(transaction.senderPublicKey, "hex"));
		}

		buf.writeBigInt64LE(transaction.fee.toBigInt());
	}

	private static serializeVendorField(transaction: ITransaction, buf: ByteBuffer): void {
		const { data }: ITransaction = transaction;

		if (data.vendorField) {
			const vf: Buffer = Buffer.from(data.vendorField, "utf8");
			buf.writeUInt8(vf.length);
			buf.writeBuffer(vf);
		} else {
			buf.writeUInt8(0x00);
		}
	}

	private static serializeSignatures(
		transaction: ITransactionData,
		buf: ByteBuffer,
		options: ISerializeOptions = {},
	): void {
		if (transaction.signature && !options.excludeSignature) {
			buf.writeBuffer(Buffer.from(transaction.signature, "hex"));
		}

		const secondSignature: string | undefined = transaction.secondSignature || transaction.signSignature;

		if (secondSignature && !options.excludeSecondSignature) {
			buf.writeBuffer(Buffer.from(secondSignature, "hex"));
		}

		if (transaction.signatures && !options.excludeMultiSignature) {
			buf.writeBuffer(Buffer.from(transaction.signatures.join(""), "hex"));
		}
	}
}
