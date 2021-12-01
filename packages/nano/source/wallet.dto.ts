import { Contracts, DTO, Exceptions } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.id;
	}

	public override balance(): Contracts.WalletBalance {
		const available: BigNumber = BigNumber.make(this.data.balance ?? 0).divide(1e30).times(1e8);

		return {
			total: available,
			available,
			fees: available,
			locked: BigNumber.make(this.data.pending ?? 0).divide(1e30).times(1e8),
		};
	}
}
