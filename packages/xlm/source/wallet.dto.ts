import { Contracts, DTO, Exceptions } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.id;
	}

	public override publicKey(): string {
		return this.data.id;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			total: this.bigNumberService.make(this.data.balances[0].balance).times(1e8),
			available: this.bigNumberService.make(this.data.balances[0].balance).times(1e8),
			fees: this.bigNumberService.make(this.data.balances[0].balance).times(1e8),
		};
	}

	public override nonce(): BigNumber {
		return BigNumber.make(this.data.sequence);
	}
}
