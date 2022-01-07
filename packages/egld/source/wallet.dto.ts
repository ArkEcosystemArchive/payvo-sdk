import { Contracts, DTO } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.id;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			available: this.bigNumberService
				.make(this.data.balance ?? 0)
				.divide(1e18)
				.times(1e8),
			fees: this.bigNumberService
				.make(this.data.balance ?? 0)
				.divide(1e18)
				.times(1e8),
			total: this.bigNumberService
				.make(this.data.balance ?? 0)
				.divide(1e18)
				.times(1e8),
		};
	}

	public override nonce(): BigNumber {
		return BigNumber.make(this.data.nonce);
	}

	public override username(): string | undefined {
		return this.data.username;
	}
}
