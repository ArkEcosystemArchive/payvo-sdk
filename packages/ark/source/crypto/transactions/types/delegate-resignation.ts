import { BigNumber } from "@payvo/sdk-helpers";
import ByteBuffer from "bytebuffer";

import { TransactionType, TransactionTypeGroup } from "../../enums";
import { ISerializeOptions } from "../../interfaces";
import { configManager } from "../../managers";
import * as schemas from "./schemas";
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
		return new ByteBuffer(0);
	}

	public deserialize(buf: ByteBuffer): void {
		return;
	}
}
