import { Contracts, DTO, IoC } from "@payvo/sdk";
import { BigNumber, NumberLike } from "@payvo/sdk-helpers";
import { calculateBalanceLockedInUnvotes, calculateBalanceLockedInVotes } from "./helpers.js";

@IoC.injectable()
export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.summary.address;
	}

	public override publicKey(): string {
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

	public override nonce(): number {
		if (this.data.sequence?.nonce) {
			return Number(this.data.sequence.nonce);
		}

		return 0;
	}

	public override username(): string | undefined {
		return this.data.dpos?.delegate?.username;
	}

	public override rank(): number | undefined {
		return this.data.dpos?.delegate?.rank;
	}

	public override votes(): BigNumber {
		if (this.data.dpos?.delegate?.totalVotesReceived) {
			return BigNumber.make(this.data.dpos.delegate.totalVotesReceived);
		}

		return BigNumber.ZERO;
	}

	public override multiSignature(): Contracts.WalletMultiSignature {
		if (!this.isMultiSignature()) {
			throw new Error("This wallet does not have a multi-signature registered.");
		}

		// @TODO: normalise
		return this.data.keys;
	}

	public override isDelegate(): boolean {
		return !!this.data.summary?.isDelegate;
	}

	public override isMultiSignature(): boolean {
		return !!this.data.summary?.isMultisignature;
	}
}
