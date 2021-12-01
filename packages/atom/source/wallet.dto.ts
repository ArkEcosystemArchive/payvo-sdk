import { Contracts, DTO, Exceptions } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.address;
	}

	public override publicKey(): string | undefined {
		return this.data.publicKey;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			available: this.bigNumberService.make(this.data.balance),
			fees: this.bigNumberService.make(this.data.balance),
			total: this.bigNumberService.make(this.data.balance),
		};
	}

	public override nonce(): BigNumber {
		return BigNumber.make(this.data.sequence);
	}
}
