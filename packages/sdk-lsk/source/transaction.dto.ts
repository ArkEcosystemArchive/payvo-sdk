import { DTO, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/intl";
import { BigNumber, convertString } from "@payvo/helpers";

import { normalizeTimestamp } from "./timestamps";
import { TransactionTypeService } from "./transaction-type.service";
import { getLisk32AddressFromPublicKey } from "@liskhq/lisk-cryptography";

const isLegacy = (data: Record<string, unknown>): boolean => data.moduleAssetName === undefined;

@IoC.injectable()
export class ConfirmedTransactionData extends DTO.AbstractConfirmedTransactionData {
	public override id(): string {
		return this.data.id;
	}

	public override blockId(): string | undefined {
		if (this.data.blockId) {
			return this.data.blockId;
		}

		return this.data.block.id;
	}

	public override timestamp(): DateTime | undefined {
		if (isLegacy(this.data)) {
			return normalizeTimestamp(this.data.timestamp);
		}

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

		return getLisk32AddressFromPublicKey(convertString(this.data.senderPublicKey));
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
		if (isLegacy(this.data)) {
			return this.data.asset.delegate.username;
		}

		return this.data.asset.username;
	}

	// Vote
	public override votes(): string[] {
		if (!Array.isArray(this.data.asset.votes)) {
			return [];
		}

		if (isLegacy(this.data)) {
			return this.data.asset.votes
				.filter((vote: string) => vote.startsWith("+"))
				.map((publicKey: string) => publicKey.substr(1));
		}

		return this.data.asset.votes
			.filter(({ amount }) => !amount.startsWith("-"))
			.map(({ delegateAddress }) => delegateAddress);
	}

	public override unvotes(): string[] {
		if (!Array.isArray(this.data.asset.votes)) {
			return [];
		}

		if (isLegacy(this.data)) {
			return this.data.asset.votes
				.filter((vote: string) => vote.startsWith("-"))
				.map((publicKey: string) => publicKey.substr(1));
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
		if (Array.isArray(this.data.asset.mandatoryKeys)) {
			return [...this.data.asset.mandatoryKeys, ...this.data.asset.optionalKeys];
		}

		return this.data.asset.multisignature?.keysgroup;
	}

	public override min(): number {
		if (this.data.asset.numberOfSignatures) {
			return this.data.asset.numberOfSignatures;
		}

		return this.data.asset.multisignature?.min;
	}
}
