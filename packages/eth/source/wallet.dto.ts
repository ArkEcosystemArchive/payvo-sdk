import { Contracts, DTO } from "@payvo/sdk";
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
			available: this.bigNumberService.make(BigInt(this.data.balance).toString()),
			fees: this.bigNumberService.make(BigInt(this.data.balance).toString()),
			total: this.bigNumberService.make(BigInt(this.data.balance).toString()),
		};
	}

	public override nonce(): BigNumber {
		return BigNumber.make(BigInt(this.data.nonce).toString());
	}
}
