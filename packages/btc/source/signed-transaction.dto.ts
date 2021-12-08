import { Contracts, DTO, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

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

	public override isMultiSignatureRegistration(): boolean {
		return this.signedData.multiSignature !== undefined && this.signedData.psbt === undefined;
	}

	public override usesMultiSignature(): boolean {
		return this.signedData.multiSignature !== undefined;
	}
}
