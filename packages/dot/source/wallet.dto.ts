import { Contracts, DTO, Exceptions } from "@payvo/sdk";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.address;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			total: this.bigNumberService.make(this.data.balance),
			available: this.bigNumberService.make(this.data.balance),
			fees: this.bigNumberService.make(this.data.balance),
		};
	}

	public override nonce(): number {
		return Number(this.data.nonce);
	}
}
