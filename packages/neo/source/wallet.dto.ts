import { Contracts, DTO, Exceptions } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.address;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			total: this.bigNumberService.make(this.data.balance ?? 0).times(1e8),
			available: this.bigNumberService.make(this.data.balance ?? 0).times(1e8),
			fees: this.bigNumberService.make(this.data.balance ?? 0).times(1e8),
		};
	}
}
