import { BigNumber, ByteBuffer } from "@payvo/sdk-helpers";

import { TransactionType, TransactionTypeGroup } from "../../enums.js";
import { ISerializeOptions } from "../../interfaces/index.js";
import { configManager } from "../../managers/index.js";
import * as schemas from "./schemas.js";
import { Transaction } from "./transaction.js";

export abstract class DelegateResignationTransaction extends Transaction {
	public static override typeGroup: number = TransactionTypeGroup.Core;
	public static override type: number = TransactionType.DelegateResignation;
	public static override key = "delegateResignation";

	protected static override defaultStaticFee: BigNumber = BigNumber.make("2500000000");

	public static override getSchema(): schemas.TransactionSchema {
		return schemas.delegateResignation;
	}

	public override verify(): boolean {
		return configManager.getMilestone().aip11 && super.verify();
	}

	public serialize(options?: ISerializeOptions): ByteBuffer | undefined {
		return new ByteBuffer(Buffer.alloc(0));
	}

	public deserialize(buf: ByteBuffer): void {
		return;
	}
}
