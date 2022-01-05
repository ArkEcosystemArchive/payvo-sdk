import { DTO } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

export class ConfirmedTransactionData extends DTO.AbstractConfirmedTransactionData {
	public override id(): string {
		return this.data.hash;
	}

	public override sender(): string {
		return this.data.from;
	}

	public override recipient(): string {
		return this.data.to;
	}

	public override amount(): BigNumber {
		return this.bigNumberService.make(BigInt(this.data.value).toString());
	}

	public override fee(): BigNumber {
		return this.bigNumberService.make(BigInt(this.data.gas).toString());
	}

	public override memo(): string | undefined {
		return this.data.data;
	}
}
