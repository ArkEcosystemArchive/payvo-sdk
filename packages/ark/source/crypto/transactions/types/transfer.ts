import { BigNumber } from "@payvo/sdk-helpers";
import ByteBuffer from "bytebuffer";

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
		const buffer: ByteBuffer = new ByteBuffer(24, true);
		buffer.writeUint64(data.amount.toString());
		buffer.writeUint32(data.expiration || 0);

		if (data.recipientId) {
			buffer.append(Address.toBuffer(data.recipientId));
		}

		return buffer;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;
		data.amount = BigNumber.make(buf.readUint64().toString());
		data.expiration = buf.readUint32();
		data.recipientId = Address.fromBuffer(buf.readBytes(21).toBuffer());
	}
}
