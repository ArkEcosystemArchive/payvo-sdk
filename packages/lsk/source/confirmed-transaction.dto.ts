import { DTO, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber, convertString } from "@payvo/sdk-helpers";

import { TransactionTypeService } from "./transaction-type.service.js";
import { getLisk32AddressFromPublicKey } from "@liskhq/lisk-cryptography";

@IoC.injectable()
export class ConfirmedTransactionData extends DTO.AbstractConfirmedTransactionData {
	public override id(): string {
		return this.data.id;
	}

	public override blockId(): string | undefined {
		return this.data.block.id;
	}

	public override timestamp(): DateTime | undefined {
		return DateTime.fromUnix(this.data.block.timestamp);
	}

	public override confirmations(): BigNumber {
		if (this.data.confirmations) {
			return BigNumber.make(this.data.confirmations);
		}

		return BigNumber.ZERO;
	}

	public override sender(): string {
		if (this.data.senderId) {
			return this.data.senderId;
		}

		if (this.data.sender?.address) {
			return this.data.sender.address;
		}

		return getLisk32AddressFromPublicKey(convertString(this.data.senderPublicKey) as any);
	}

	public override recipient(): string {
		if (this.data.recipientId) {
			return this.data.recipientId;
		}

		if (this.data.asset.recipient?.address) {
			return this.data.asset.recipient.address;
		}

		return this.data.sender.address;
	}

	public override amount(): BigNumber {
		if (this.isUnlockToken()) {
			let amount = this.bigNumberService.make(0);

			for (const unlockObject of this.data.asset.unlockObjects) {
				amount = amount.plus(this.bigNumberService.make(unlockObject.amount));
			}

			return amount;
		}

		if (this.data.amount) {
			return this.bigNumberService.make(this.data.amount);
		}

		if (this.data.asset?.amount) {
			return this.bigNumberService.make(this.data.asset.amount);
		}

		return BigNumber.ZERO;
	}

	public override fee(): BigNumber {
		return this.bigNumberService.make(this.data.fee);
	}

	public override memo(): string | undefined {
		return this.data.asset.data;
	}

	public override asset(): Record<string, unknown> {
		return this.data.asset;
	}

	public override isConfirmed(): boolean {
		return true;
	}

	public override isReturn(): boolean {
		if (this.isTransfer()) {
			return this.isSent() && this.isReceived();
		}

		return false;
	}

	public override isSent(): boolean {
		return [this.getMeta("address"), this.getMeta("publicKey")].includes(this.sender());
	}

	public override isReceived(): boolean {
		return [this.getMeta("address"), this.getMeta("publicKey")].includes(this.recipient());
	}

	public override isTransfer(): boolean {
		return TransactionTypeService.isTransfer(this.data);
	}

	public override isSecondSignature(): boolean {
		return TransactionTypeService.isSecondSignature(this.data);
	}

	public override isDelegateRegistration(): boolean {
		return TransactionTypeService.isDelegateRegistration(this.data);
	}

	public override isVoteCombination(): boolean {
		return TransactionTypeService.isVoteCombination(this.data);
	}

	public override isVote(): boolean {
		return TransactionTypeService.isVote(this.data);
	}

	public override isUnvote(): boolean {
		return TransactionTypeService.isUnvote(this.data);
	}

	public override isMultiSignatureRegistration(): boolean {
		return TransactionTypeService.isMultiSignatureRegistration(this.data);
	}

	public override isUnlockToken(): boolean {
		return TransactionTypeService.isUnlockToken(this.data);
	}

	// Delegate Registration
	public override username(): string {
		return this.data.asset.username;
	}

	// Vote
	public override votes(): string[] {
		if (!Array.isArray(this.data.asset.votes)) {
			return [];
		}

		return this.data.asset.votes
			.filter(({ amount }) => !amount.startsWith("-"))
			.map(({ delegateAddress }) => delegateAddress);
	}

	public override unvotes(): string[] {
		if (!Array.isArray(this.data.asset.votes)) {
			return [];
		}

		return this.data.asset.votes
			.filter(({ amount }) => amount.startsWith("-"))
			.map(({ delegateAddress }) => delegateAddress);
	}

	// Second-Signature Registration
	public override secondPublicKey(): string {
		return this.data.asset.signature?.publicKey;
	}

	// Multi-Signature Registration
	public override publicKeys(): string[] {
		if (!Array.isArray(this.data.asset.mandatoryKeys)) {
			return [];
		}

		return [...this.data.asset.mandatoryKeys, ...this.data.asset.optionalKeys];
	}

	public override min(): number {
		return this.data.asset.numberOfSignatures;
	}
}
