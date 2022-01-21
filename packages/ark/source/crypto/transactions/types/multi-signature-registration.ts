import { BigNumber, ByteBuffer } from "@payvo/sdk-helpers";

import { TransactionType, TransactionTypeGroup } from "../../enums.js";
import { IMultiSignatureAsset, ISerializeOptions, ITransactionData } from "../../interfaces/index.js";
import { configManager } from "../../managers/index.js";
import * as schemas from "./schemas.js";
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
		const buf: ByteBuffer = new ByteBuffer(Buffer.alloc(2 + publicKeys.length * 33));

		buf.writeUInt8(min);
		buf.writeUInt8(publicKeys.length);

		for (const publicKey of publicKeys) {
			buf.writeBuffer(Buffer.from(publicKey, "hex"));
		}

		return buf;
	}

	public deserialize(buf: ByteBuffer): void {
		const { data } = this;

		const multiSignature: IMultiSignatureAsset = { publicKeys: [], min: 0 };
		multiSignature.min = buf.readUInt8();

		const count = buf.readUInt8();
		for (let i = 0; i < count; i++) {
			const publicKey = buf.readBuffer(33).toString("hex");
			multiSignature.publicKeys.push(publicKey);
		}

		data.asset = { multiSignature };
	}
}
