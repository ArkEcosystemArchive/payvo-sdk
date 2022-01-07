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
		const available: BigNumber = this.bigNumberService
			.make(this.data.balance.find(({ asset_symbol }) => asset_symbol === "NEO").amount ?? 0)
			.times(1e8);
		const fees: BigNumber = this.bigNumberService
			.make(this.data.balance.find(({ asset_symbol }) => asset_symbol === "GAS").amount ?? 0)
			.times(1e8);

		return {
			available,
			fees,
			total: available.plus(fees),
		};
	}
}
