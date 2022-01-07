import { BigNumber } from "@payvo/sdk-helpers";
import ByteBuffer from "bytebuffer";

import { TransactionType, TransactionTypeGroup } from "../../enums.js";
import { ISerializeOptions } from "../../interfaces/index.js";
import * as schemas from "./schemas.js";
import { Transaction } from "./transaction.js";

export abstract class DelegateRegistrationTransaction extends Transaction {
	public static override typeGroup: number = TransactionTypeGroup.Core;
	public static override type: number = TransactionType.DelegateRegistration;
	public static override key = "delegateRegistration";

	protected static override defaultStaticFee: BigNumber = BigNumber.make("2500000000");

	public static override getSchema(): schemas.TransactionSchema {
		return schemas.delegateRegistration;
	}

	public serialize(options?: ISerializeOptions): ByteBuffer | undefined {
		const { data } = this;

		if (data.asset && data.asset.delegate) {
			const delegateBytes: Buffer = Buffer.from(data.asset.delegate.username, "utf8");
			const buffer: ByteBuffer = new ByteBuffer(delegateBytes.length, true);

			buffer.writeByte(delegateBytes.length);
			buffer.append(delegateBytes, "hex");

			return buffer;
		}

		return undefined;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;
		const usernamelength: number = buf.readUint8();

		data.asset = {
			delegate: {
				username: buf.readString(usernamelength),
			},
		};
	}
}
