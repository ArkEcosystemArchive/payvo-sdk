import { Contracts, DTO, Exceptions, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

@IoC.injectable()
export class ConfirmedTransactionData extends DTO.AbstractConfirmedTransactionData {
	public override id(): string {
		return this.data.id;
	}

	public override sender(): string {
		return this.data.sender;
	}

	public override recipient(): string {
		return this.data.recipient;
	}

	public override recipients(): Contracts.MultiPaymentRecipient[] {
		return [{ address: this.recipient(), amount: this.amount() }];
	}

	public override amount(): BigNumber {
		return this.bigNumberService.make(this.data.amount);
	}

	public override fee(): BigNumber {
		return BigNumber.make(this.data.gasUsed).times(this.data.gasPrice);
	}

	public override isConfirmed(): boolean {
		return this.data.isConfirmed;
	}

	public override isSent(): boolean {
		return this.data.isSent;
	}
}
