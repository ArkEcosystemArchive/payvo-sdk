import { DTO } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";

export class ConfirmedTransactionData extends DTO.AbstractConfirmedTransactionData {
	public override id(): string {
		return this.data.hash;
	}

	public override hash(): string {
		return this.data.hash;
	}

	public override blockId(): string | undefined {
		return this.data.block_hash;
	}

	public override timestamp(): DateTime | undefined {
		return DateTime.fromUnix(this.data.timestamp);
	}

	public override sender(): string {
		return this.data.from;
	}

	public override recipient(): string {
		return this.data.to;
	}

	public override amount(): BigNumber {
		return this.bigNumberService.make(BigInt(this.data.amount).toString());
	}

	public override fee(): BigNumber {
		return this.bigNumberService.make(BigInt(this.data.fee).toString());
	}

	public override memo(): string | undefined {
		return this.data.memo;
	}
}
