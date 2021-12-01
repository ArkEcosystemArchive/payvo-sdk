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
		// AVAX uses 1e9 instead of the conventional 1e8 so
		// we divide by 1e1 which will normalise it to 1e8 to be
		// consistent for future use by other packages that use it.

		return {
			total: this.bigNumberService.make(this.data.balance / 1e1),
			available: this.bigNumberService.make(this.data.balance / 1e1),
			fees: this.bigNumberService.make(this.data.balance / 1e1),
		};
	}

	public override multiSignature(): Contracts.WalletMultiSignature {
		throw new Error("This wallet does not have a multi-signature registered.");
	}
}
