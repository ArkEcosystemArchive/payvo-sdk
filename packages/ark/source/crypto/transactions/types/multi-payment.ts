import { BigNumber, ByteBuffer } from "@payvo/sdk-helpers";

import { TransactionType, TransactionTypeGroup } from "../../enums.js";
import { Address } from "../../identities/address.js";
import { IMultiPaymentItem, ISerializeOptions } from "../../interfaces/index.js";
import { configManager } from "../../managers/index.js";
import * as schemas from "./schemas.js";
import { Transaction } from "./transaction.js";

export abstract class MultiPaymentTransaction extends Transaction {
	public static override typeGroup: number = TransactionTypeGroup.Core;
	public static override type: number = TransactionType.MultiPayment;
	public static override key = "multiPayment";

	protected static override defaultStaticFee: BigNumber = BigNumber.make("10000000");

	public static override getSchema(): schemas.TransactionSchema {
		return schemas.multiPayment;
	}

	public override verify(): boolean {
		return configManager.getMilestone().aip11 && super.verify();
	}

	public override hasVendorField(): boolean {
		return true;
	}

	public serialize(options: ISerializeOptions = {}): ByteBuffer | undefined {
		const { data } = this;

		if (data.asset && data.asset.payments) {
			const buf: ByteBuffer = new ByteBuffer(Buffer.alloc(2 + data.asset.payments.length * 29));
			buf.writeUInt16LE(data.asset.payments.length);

			for (const payment of data.asset.payments) {
				buf.writeBigUInt64LE(payment.amount.toBigInt());
				buf.writeBuffer(Address.toBuffer(payment.recipientId));
			}

			return buf;
		}

		return undefined;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;
		const payments: IMultiPaymentItem[] = [];
		const total: number = buf.readUInt16LE();

		for (let j = 0; j < total; j++) {
			payments.push({
				amount: BigNumber.make(buf.readBigUInt64LE().toString()),
				recipientId: Address.fromBuffer(buf.readBuffer(21)),
			});
		}

		data.amount = BigNumber.ZERO;
		data.asset = { payments };
	}
}
