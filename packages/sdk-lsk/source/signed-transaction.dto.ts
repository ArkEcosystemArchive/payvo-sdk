import { Contracts, DTO, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";
import { getLisk32AddressFromAddress, getLisk32AddressFromPublicKey } from "@liskhq/lisk-cryptography";

import { normalizeTimestamp } from "./timestamps";
import { TransactionTypeService } from "./transaction-type.service";
import { isDelegateRegistration, isMultiSignatureRegistration, isTransfer, isUnlockToken, isVote } from "./helpers";

@IoC.injectable()
export class SignedTransactionData
	extends DTO.AbstractSignedTransactionData
	implements Contracts.SignedTransactionData
{
	public override sender(): string {
		if (this.signedData.moduleID) {
			return getLisk32AddressFromPublicKey(Buffer.from(this.signedData.senderPublicKey, "hex"));
		}

		return this.signedData.senderId;
	}

	public override recipient(): string {
		if (this.signedData.moduleID) {
			if (Buffer.isBuffer(this.signedData.asset.recipientAddress)) {
				return getLisk32AddressFromAddress(this.signedData.asset.recipientAddress);
			}

			return this.signedData.asset.recipientAddress;
		}

		return this.signedData.recipientId;
	}

	public override amount(): BigNumber {
		if (this.isUnlockToken()) {
			let amount = this.bigNumberService.make(0);

			for (const unlockObject of this.signedData.asset.unlockObjects) {
				amount = amount.plus(this.bigNumberService.make(unlockObject.amount));
			}

			return amount;
		}

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
		if (this.signedData.moduleID) {
			return Array.isArray(this.signedData.signatures) && this.signedData.signatures.length >= 2;
		}

		return typeof this.signedData.multiSignature === "object";
	}

	public override isUnlockToken(): boolean {
		if (this.signedData.moduleID) {
			return isUnlockToken(this.signedData);
		}

		return TransactionTypeService.isUnlockToken(this.signedData);
	}

	public override username(): string {
		if (this.signedData.moduleID) {
			return this.signedData.asset.username;
		}

		return this.signedData.asset.delegate?.username;
	}
}
