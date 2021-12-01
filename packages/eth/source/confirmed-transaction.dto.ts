import { Contracts, DTO, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";
import Web3 from "web3";

@IoC.injectable()
export class ConfirmedTransactionData extends DTO.AbstractConfirmedTransactionData {
	public override id(): string {
		return this.data.hash;
	}

	public override blockId(): string | undefined {
		return undefined;
	}

	public override timestamp(): DateTime | undefined {
		return undefined;
	}

	public override sender(): string {
		return this.data.from;
	}

	public override recipient(): string {
		return this.data.to;
	}

	public override amount(): BigNumber {
		return this.bigNumberService.make(Web3.utils.toBN(this.data.value).toString());
	}

	public override fee(): BigNumber {
		return this.bigNumberService.make(Web3.utils.toBN(this.data.gas).toString());
	}

	public override memo(): string | undefined {
		return this.data.data;
	}
}
