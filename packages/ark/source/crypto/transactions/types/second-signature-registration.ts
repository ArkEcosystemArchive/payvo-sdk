import { BigNumber, ByteBuffer } from "@payvo/sdk-helpers";

import { TransactionType, TransactionTypeGroup } from "../../enums.js";
import { ISerializeOptions } from "../../interfaces/index.js";
import * as schemas from "./schemas.js";
import { Transaction } from "./transaction.js";

export abstract class SecondSignatureRegistrationTransaction extends Transaction {
	public static override typeGroup: number = TransactionTypeGroup.Core;
	public static override type: number = TransactionType.SecondSignature;
	public static override key = "secondSignature";

	protected static override defaultStaticFee: BigNumber = BigNumber.make("500000000");

	public static override getSchema(): schemas.TransactionSchema {
		return schemas.secondSignature;
	}

	public serialize(options?: ISerializeOptions): ByteBuffer | undefined {
		const { data } = this;
		const buf: ByteBuffer = new ByteBuffer(Buffer.alloc(33));

		if (data.asset && data.asset.signature) {
			buf.writeBuffer(Buffer.from(data.asset.signature.publicKey, "hex"));
		}

		return buf;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;

		data.asset = {
			signature: {
				publicKey: buf.readBuffer(33).toString("hex"),
			},
		};
	}
}
