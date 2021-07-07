import { Contracts, DTO, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";

@IoC.injectable()
export class SignedTransactionData
	extends DTO.AbstractSignedTransactionData
	implements Contracts.SignedTransactionData
{
	public override sender(): string {
		return this.signedData.fromAddress;
	}

	public override recipient(): string {
		return this.signedData.toAddress;
	}

	public override amount(): BigNumber {
		return this.bigNumberService.make(this.signedData.amountRaw);
	}

	public override fee(): BigNumber {
		return BigNumber.ZERO;
	}

	public override timestamp(): DateTime {
		return DateTime.make(this.signedData.timestamp);
	}
}
