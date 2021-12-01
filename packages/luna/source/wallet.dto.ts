import { Contracts, DTO } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override balance(): Contracts.WalletBalance {
		return {
			total: BigNumber.ZERO,
			available: BigNumber.ZERO,
			fees: BigNumber.ZERO,
		};
	}
}
