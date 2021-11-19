import { Contracts, DTO, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";
import { getLisk32AddressFromAddress, getLisk32AddressFromPublicKey } from "@liskhq/lisk-cryptography";

import { isDelegateRegistration, isMultiSignatureRegistration, isTransfer, isUnlockToken, isVote } from "./helpers.js";

@IoC.injectable()
export class SignedTransactionData
	extends DTO.AbstractSignedTransactionData
	implements Contracts.SignedTransactionData
{
	public override sender(): string {
		return getLisk32AddressFromPublicKey(Buffer.from(this.signedData.senderPublicKey, "hex"));
	}

	public override recipient(): string {
		if (Buffer.isBuffer(this.signedData.asset.recipientAddress)) {
			return getLisk32AddressFromAddress(this.signedData.asset.recipientAddress);
		}

		return this.signedData.asset.recipientAddress;
	}

	public override amount(): BigNumber {
		if (this.isUnlockToken()) {
			let amount = this.bigNumberService.make(0);

			for (const unlockObject of this.signedData.asset.unlockObjects) {
				amount = amount.plus(this.bigNumberService.make(unlockObject.amount));
			}

			return amount;
		}

		return this.bigNumberService.make(this.signedData.asset.amount ?? BigNumber.ZERO);
	}

	public override fee(): BigNumber {
		return this.bigNumberService.make(this.signedData.fee);
	}

	public override timestamp(): DateTime {
		if (typeof this.signedData.timestamp === "number") {
			return DateTime.fromUnix(this.signedData.timestamp);
		}

		if (this.signedData.timestamp) {
			return DateTime.make(this.signedData.timestamp);
		}

		return DateTime.make();
	}

	public override isTransfer(): boolean {
		return isTransfer(this.signedData);
	}

	public override isSecondSignature(): boolean {
		return false;
	}

	public override isDelegateRegistration(): boolean {
		return isDelegateRegistration(this.signedData);
	}

	public override isVoteCombination(): boolean {
		return this.isVote() && this.isUnvote();
	}

	public override isVote(): boolean {
		if (!isVote(this.signedData)) {
			return false;
		}

		return this.signedData.asset.votes.some(({ amount }) => !amount.toString().startsWith("-"));
	}

	public override isUnvote(): boolean {
		if (!isVote(this.signedData)) {
			return false;
		}

		return this.signedData.asset.votes.some(({ amount }) => amount.toString().startsWith("-"));
	}

	public override isMultiSignatureRegistration(): boolean {
		return isMultiSignatureRegistration(this.signedData);
	}

	public override usesMultiSignature(): boolean {
		return Array.isArray(this.signedData.signatures) && this.signedData.signatures.length >= 2;
	}

	public override isUnlockToken(): boolean {
		return isUnlockToken(this.signedData);
	}

	public override username(): string {
		return this.signedData.asset.username;
	}
}
