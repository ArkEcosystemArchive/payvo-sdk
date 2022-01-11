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
		const tokens: Record<string, BigNumber> = this.data.tokens;

		Object.keys(tokens).map((key: string) => tokens[key] = this.bigNumberService.make(tokens[key]));

		return {
			available: this.bigNumberService.make(BigInt(this.data.balance).toString()),
			fees: this.bigNumberService.make(BigInt(this.data.balance).toString()),
			total: this.bigNumberService.make(BigInt(this.data.balance).toString()),
			tokens,
		};
	}

	public override nonce(): BigNumber {
		return BigNumber.make(BigInt(this.data.nonce).toString());
	}
}
