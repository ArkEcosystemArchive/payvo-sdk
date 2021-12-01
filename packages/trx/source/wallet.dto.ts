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
		const tokens = {};

		if (this.data.trc20) {
			for (const trc20 of Object.values(this.data.trc20) as any) {
				for (const [address, balance] of Object.entries(trc20)) {
					tokens[address] = BigNumber.make(balance as number).times(1e2);
				}
			}
		}

		const available = BigNumber.make(this.data.balance).times(1e2);

		return {
			total: available,
			available,
			fees: available,
			locked: this.data.frozen?.frozen_balance
				? BigNumber.make(this.data.frozen?.frozen_balance).times(1e2)
				: BigNumber.ZERO,
			tokens,
		};
	}
}
