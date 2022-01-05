import { Contracts, DTO } from "@payvo/sdk";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.id;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			total: this.bigNumberService.make(this.data.balance.available?.quantity ?? 0),
			available: this.bigNumberService.make(this.data.balance.available?.quantity ?? 0),
			fees: this.bigNumberService.make(this.data.balance.reward?.quantity ?? 0),
		};
	}
}
