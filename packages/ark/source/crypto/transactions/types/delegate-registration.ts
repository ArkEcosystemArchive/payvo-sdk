import { BigNumber, ByteBuffer } from "@payvo/sdk-helpers";

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
			const buf: ByteBuffer = new ByteBuffer(Buffer.alloc(delegateBytes.length + 1));

			buf.writeUInt8(delegateBytes.length);
			buf.writeBuffer(delegateBytes);

			return buf;
		}

		return undefined;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;
		const usernameLength = buf.readUInt8();

		data.asset = {
			delegate: {
				username: buf.readBuffer(usernameLength).toString("utf8"),
			},
		};
	}
}
