import { BigNumber } from "@payvo/sdk-helpers";

import { ITransactionData } from "../../interfaces/index.js";
import { DelegateResignationTransaction } from "../types/index.js";
import { TransactionBuilder } from "./transaction.js";

export class DelegateResignationBuilder extends TransactionBuilder<DelegateResignationBuilder> {
	public constructor() {
		super();

		this.data.type = DelegateResignationTransaction.type;
		this.data.typeGroup = DelegateResignationTransaction.typeGroup;
		this.data.version = 2;
		this.data.fee = DelegateResignationTransaction.staticFee();
		this.data.amount = BigNumber.ZERO;
		this.data.senderPublicKey = undefined;
	}

	public override getStruct(): ITransactionData {
		const struct: ITransactionData = super.getStruct();
		struct.amount = this.data.amount;
		return struct;
	}

	protected instance(): DelegateResignationBuilder {
		return this;
	}
}
