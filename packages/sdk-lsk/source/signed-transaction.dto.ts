import { Contracts, DTO, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";

import { normalizeTimestamp } from "./timestamps";
import { TransactionTypeService } from "./transaction-type.service";
import { isDelegateRegistration, isMultiSignatureRegistration, isTransfer, isVote } from "./helpers";

@IoC.injectable()
export class SignedTransactionData
	extends DTO.AbstractSignedTransactionData
	implements Contracts.SignedTransactionData
{
	public override sender(): string {
		if (this.signedData.moduleID) {
			return this.signedData.senderPublicKey;
		}

		return this.signedData.senderId;
	}

	public override recipient(): string {
		if (this.signedData.moduleID) {
			return this.signedData.asset.recipientAddress;
		}

		return this.signedData.recipientId;
	}

	public override amount(): BigNumber {
		if (this.signedData.moduleID) {
			return this.bigNumberService.make(this.signedData.asset.amount);
		}

		return this.bigNumberService.make(this.signedData.amount);
	}

	public override fee(): BigNumber {
		return this.bigNumberService.make(this.signedData.fee);
	}

	public override timestamp(): DateTime {
		if (this.timestamp instanceof DateTime) {
			return this.signedData.timestamp;
		}

		return normalizeTimestamp(this.signedData.timestamp);
	}

	public override isTransfer(): boolean {
		if (this.signedData.moduleID) {
			return isTransfer(this.signedData);
		}

		return TransactionTypeService.isTransfer(this.signedData);
	}

	public override isSecondSignature(): boolean {
		return TransactionTypeService.isSecondSignature(this.signedData);
	}

	public override isDelegateRegistration(): boolean {
		if (this.signedData.moduleID) {
			return isDelegateRegistration(this.signedData);
		}

		return TransactionTypeService.isDelegateRegistration(this.signedData);
	}

	public override isVoteCombination(): boolean {
		if (this.signedData.moduleID) {
			return this.isVote() && this.isUnvote();
		}

		return TransactionTypeService.isVoteCombination(this.signedData);
	}

	public override isVote(): boolean {
		if (this.signedData.moduleID) {
			if (!isVote(this.signedData)) {
				return false;
			}

			return this.signedData.asset.votes.some(({ amount }) => !amount.toString().startsWith("-"));
		}

		return TransactionTypeService.isVote(this.signedData);
	}

	public override isUnvote(): boolean {
		if (this.signedData.moduleID) {
			if (!isVote(this.signedData)) {
				return false;
			}

			return this.signedData.asset.votes.some(({ amount }) => amount.toString().startsWith("-"));
		}

		return TransactionTypeService.isUnvote(this.signedData);
	}

	public override isMultiSignatureRegistration(): boolean {
		if (this.signedData.moduleID) {
			return isMultiSignatureRegistration(this.signedData);
		}

		return TransactionTypeService.isMultiSignatureRegistration(this.signedData);
	}

	public override usesMultiSignature(): boolean {
		if (Array.isArray(this.signedData.signatures)) {
			return true;
		}

		return !!this.signedData.multiSignature;
	}
}
