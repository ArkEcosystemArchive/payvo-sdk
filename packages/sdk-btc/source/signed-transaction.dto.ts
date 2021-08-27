import { Contracts, DTO, Exceptions, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";

@IoC.injectable()
export class SignedTransactionData
	extends DTO.AbstractSignedTransactionData
	implements Contracts.SignedTransactionData
{
	public override sender(): string {
		return this.signedData.sender;
	}

	public override recipient(): string {
		return this.signedData.recipient;
	}

	public override amount(): BigNumber {
		return this.bigNumberService.make(this.signedData.amount);
	}

	public override fee(): BigNumber {
		return this.bigNumberService.make(this.signedData.fee);
	}

	public override timestamp(): DateTime {
		return DateTime.make(this.signedData.timestamp);
	}
}
