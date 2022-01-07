import { BigNumber } from "@payvo/sdk-helpers";
import ByteBuffer from "bytebuffer";

import { TransactionType, TransactionTypeGroup } from "../../enums";
import { IMultiSignatureAsset, ISerializeOptions, ITransactionData } from "../../interfaces";
import { configManager } from "../../managers";
import * as schemas from "./schemas";
import { Transaction } from "./transaction.js";

export class MultiSignatureRegistrationTransaction extends Transaction {
	public static override typeGroup: number = TransactionTypeGroup.Core;
	public static override type: number = TransactionType.MultiSignature;
	public static override key = "multiSignature";

	protected static override defaultStaticFee: BigNumber = BigNumber.make("500000000");

	public static override getSchema(): schemas.TransactionSchema {
		return schemas.multiSignature;
	}

	public static override staticFee(feeContext: { height?: number; data?: ITransactionData } = {}): BigNumber {
		if (feeContext.data?.asset?.multiSignature) {
			return super.staticFee(feeContext).times(feeContext.data.asset.multiSignature.publicKeys.length + 1);
		}

		return super.staticFee(feeContext);
	}

	public override verify(): boolean {
		return configManager.getMilestone().aip11 && super.verify();
	}

	public serialize(options?: ISerializeOptions): ByteBuffer | undefined {
		const { data } = this;
		const { min, publicKeys } = data.asset!.multiSignature!;
		const buffer: ByteBuffer = new ByteBuffer(2 + publicKeys.length * 33);

		buffer.writeUint8(min);
		buffer.writeUint8(publicKeys.length);

		for (const publicKey of publicKeys) {
			buffer.append(publicKey, "hex");
		}

		return buffer;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;

		const multiSignature: IMultiSignatureAsset = { min: 0, publicKeys: [] };
		multiSignature.min = buf.readUint8();

		const count = buf.readUint8();
		for (let index = 0; index < count; index++) {
			const publicKey = buf.readBytes(33).toString("hex");
			multiSignature.publicKeys.push(publicKey);
		}

		data.asset = { multiSignature };
	}
}
