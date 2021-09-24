import { Contracts, DTO, IoC } from "@payvo/sdk";
import { BigNumber, NumberLike } from "@payvo/helpers";
import { calculateBalanceLockedInUnvotes, calculateBalanceLockedInVotes } from "./helpers";

@IoC.injectable()
export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		if (this.data.address) {
			return this.data.address;
		}

		if (this.data.account?.address) {
			return this.data.account?.address;
		}

		return this.data.summary.address;
	}

	public override publicKey(): string {
		if (this.data.publicKey) {
			return this.data.publicKey;
		}

		if (this.data.account?.publicKey) {
			return this.data.account?.publicKey;
		}

		return this.data.summary.publicKey;
	}

	public override balance(): Contracts.WalletBalance {
		let balance: NumberLike = NaN;

		if (this.data.summary?.balance) {
			balance = this.data.summary?.balance;
		}

		if (this.data.token?.balance) {
			balance = this.data.token?.balance;
		}

		const lockedVotes: BigNumber = this.bigNumberService.make(
			calculateBalanceLockedInVotes(this.data.dpos.sentVotes ?? []),
		);
		const lockedUnvotes: BigNumber = this.bigNumberService.make(
			calculateBalanceLockedInUnvotes(this.data.dpos.unlocking ?? []),
		);
		const locked: BigNumber = lockedVotes.plus(lockedUnvotes);

		const availableBalance: BigNumber = this.bigNumberService.make(balance).minus(5000000);

		return {
			total: availableBalance.plus(locked),
			available: availableBalance,
			fees: availableBalance,
			locked,
			lockedVotes,
			lockedUnvotes,
		};
	}

	public override nonce(): BigNumber {
		if (this.data.sequence?.nonce) {
			return BigNumber.make(this.data.sequence.nonce);
		}

		return BigNumber.ZERO;
	}

	public override secondPublicKey(): string | undefined {
		return this.data.secondPublicKey;
	}

	public override username(): string | undefined {
		if (this.data.username) {
			return this.data.username;
		}

		if (this.data.account?.username) {
			return this.data.account?.username;
		}

		return this.data.summary.username;
	}

	public override rank(): number | undefined {
		if (this.data.rank) {
			return this.data.rank;
		}

		if (this.data.delegate?.rank) {
			return this.data.delegate?.rank;
		}

		return this.data.dpos?.delegate?.rank;
	}

	public override votes(): BigNumber | undefined {
		if (this.data.rank) {
			return BigNumber.make(this.data.rank);
		}

		if (this.data.delegate?.vote) {
			return BigNumber.make(this.data.delegate?.vote);
		}

		if (this.data.dpos?.delegate?.totalVotesReceived) {
			return BigNumber.make(this.data.dpos.delegate.totalVotesReceived);
		}

		return BigNumber.ZERO;
	}

	public multiSignature(): Contracts.WalletMultiSignature {
		if (!this.isMultiSignature()) {
			throw new Error("This wallet does not have a multi-signature registered.");
		}

		if (this.data.multiSignature) {
			return this.data.multiSignature;
		}

		// @TODO: normalise
		return this.data.keys;
	}

	public override isDelegate(): boolean {
		return !!this.data.delegate || !!this.data.summary?.isDelegate;
	}

	public override isResignedDelegate(): boolean {
		return false;
	}

	public override isMultiSignature(): boolean {
		return !!this.data.summary?.isMultisignature;
	}

	public override isSecondSignature(): boolean {
		return !!this.data.secondPublicKey;
	}
}
