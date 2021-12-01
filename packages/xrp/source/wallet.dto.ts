import { Contracts, DTO } from "@payvo/sdk";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.Account;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			total: this.bigNumberService.make(this.data.Balance).times(1e8),
			available: this.bigNumberService.make(this.data.Balance).times(1e8),
			fees: this.bigNumberService.make(this.data.Balance).times(1e8),
		};
	}

	public override nonce(): number {
		return Number(this.data.Sequence);
	}
}
