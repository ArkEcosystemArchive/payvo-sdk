import { BigNumber } from "@payvo/sdk-helpers";
import ByteBuffer from "bytebuffer";

import { TransactionType, TransactionTypeGroup } from "../../enums";
import { Address } from "../../identities/address.js";
import { IMultiPaymentItem, ISerializeOptions } from "../../interfaces";
import { configManager } from "../../managers";
import * as schemas from "./schemas";
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
			const buffer: ByteBuffer = new ByteBuffer(2 + data.asset.payments.length * 29, true);
			buffer.writeUint16(data.asset.payments.length);

			for (const payment of data.asset.payments) {
				buffer.writeUint64(payment.amount.toString());

				buffer.append(Address.toBuffer(payment.recipientId));
			}

			return buffer;
		}

		return undefined;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;
		const payments: IMultiPaymentItem[] = [];
		const total: number = buf.readUint16();

		for (let index = 0; index < total; index++) {
			payments.push({
				amount: BigNumber.make(buf.readUint64().toString()),
				recipientId: Address.fromBuffer(buf.readBytes(21).toBuffer()),
			});
		}

		data.amount = BigNumber.ZERO;
		data.asset = { payments };
	}
}
