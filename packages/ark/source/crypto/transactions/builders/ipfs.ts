import { BigNumber } from "@payvo/sdk-helpers";

import { ITransactionData } from "../../interfaces/index.js";
import { IpfsTransaction } from "../types/index.js";
import { TransactionBuilder } from "./transaction.js";

export class IPFSBuilder extends TransactionBuilder<IPFSBuilder> {
	public constructor() {
		super();

		this.data.type = IpfsTransaction.type;
		this.data.typeGroup = IpfsTransaction.typeGroup;
		this.data.fee = IpfsTransaction.staticFee();
		this.data.amount = BigNumber.ZERO;
		this.data.asset = {};
	}

	public ipfsAsset(ipfsId: string): IPFSBuilder {
		this.data.asset = {
			ipfs: ipfsId,
		};

		return this;
	}

	public override getStruct(): ITransactionData {
		const struct: ITransactionData = super.getStruct();
		struct.amount = this.data.amount;
		struct.asset = this.data.asset;
		return struct;
	}

	protected instance(): IPFSBuilder {
		return this;
	}
}
