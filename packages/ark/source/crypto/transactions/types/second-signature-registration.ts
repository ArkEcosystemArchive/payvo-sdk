import { BigNumber } from "@payvo/sdk-helpers";
import ByteBuffer from "bytebuffer";

import { TransactionType, TransactionTypeGroup } from "../../enums";
import { ISerializeOptions } from "../../interfaces";
import * as schemas from "./schemas";
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
		const buffer: ByteBuffer = new ByteBuffer(33, true);

		if (data.asset && data.asset.signature) {
			buffer.append(data.asset.signature.publicKey, "hex");
		}

		return buffer;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;

		data.asset = {
			signature: {
				publicKey: buf.readBytes(33).toString("hex"),
			},
		};
	}
}
