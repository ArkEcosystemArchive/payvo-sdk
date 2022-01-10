import { BigNumber, ByteBuffer } from "@payvo/sdk-helpers";

import { TransactionType, TransactionTypeGroup } from "../../enums.js";
import { Address } from "../../identities/address.js";
import { ISerializeOptions } from "../../interfaces/index.js";
import * as schemas from "./schemas.js";
import { Transaction } from "./transaction.js";

export abstract class TransferTransaction extends Transaction {
	public static override typeGroup: number = TransactionTypeGroup.Core;
	public static override type: number = TransactionType.Transfer;
	public static override key = "transfer";

	protected static override defaultStaticFee: BigNumber = BigNumber.make("10000000");

	public static override getSchema(): schemas.TransactionSchema {
		return schemas.transfer;
	}

	public override hasVendorField(): boolean {
		return true;
	}

	public serialize(options?: ISerializeOptions): ByteBuffer | undefined {
		const { data } = this;
		const buff: ByteBuffer = new ByteBuffer(Buffer.alloc(33));
		buff.writeBigUInt64LE(data.amount.toBigInt());
		buff.writeUInt32LE(data.expiration || 0);

		if (data.recipientId) {
			buff.writeBuffer(Address.toBuffer(data.recipientId));
		}

		return buff;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;
		data.amount = BigNumber.make(buf.readBigUInt64LE().toString());
		data.expiration = buf.readUInt32LE();
		data.recipientId = Address.fromBuffer(buf.readBuffer(21));
	}
}
