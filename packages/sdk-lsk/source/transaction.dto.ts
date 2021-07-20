import { DTO, IoC } from "@payvo/sdk";
import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";

import { normalizeTimestamp } from "./timestamps";
import { TransactionTypeService } from "./transaction-type.service";
import { getLisk32AddressFromPublicKey } from "@liskhq/lisk-cryptography";
import { convertString } from "./multi-signature.domain";

const isTest = (data: Record<string, unknown>): boolean => data.moduleAssetName !== undefined;

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
		if (isTest(this.data)) {
			return DateTime.fromUnix(this.data.block.timestamp);
		}

		return normalizeTimestamp(this.data.timestamp);
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

	// Delegate Registration
	public override username(): string {
		if (isTest(this.data)) {
			return this.data.asset.username;
		}

		return this.data.asset.delegate.username;
	}

	// Vote
	public override votes(): string[] {
		if (!Array.isArray(this.data.asset.votes)) {
			return [];
		}

		if (isTest(this.data)) {
			return this.data.asset.votes
				.filter(({ amount }) => !amount.startsWith("-"))
				.map(({ delegateAddress }) => delegateAddress);
		}

		return this.data.asset.votes
			.filter((vote: string) => vote.startsWith("+"))
			.map((publicKey: string) => publicKey.substr(1));
	}

	public override unvotes(): string[] {
		if (!Array.isArray(this.data.asset.votes)) {
			return [];
		}

		if (isTest(this.data)) {
			return this.data.asset.votes
				.filter(({ amount }) => amount.startsWith("-"))
				.map(({ delegateAddress }) => delegateAddress);
		}

		return this.data.asset.votes
			.filter((vote: string) => vote.startsWith("-"))
			.map((publicKey: string) => publicKey.substr(1));
	}

	// Second-Signature Registration
	public override secondPublicKey(): string {
		return this.data.asset.signature?.publicKey;
	}

	// Multi-Signature Registration
	public override publicKeys(): string[] {
		return this.data.asset.multisignature?.keysgroup;
	}

	public override min(): number {
		return this.data.asset.multisignature?.min;
	}
}
