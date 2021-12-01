import { Contracts, DTO } from "@payvo/sdk";
import Web3 from "web3";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.address;
	}

	public override publicKey(): string | undefined {
		return undefined;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			total: this.bigNumberService.make(Web3.utils.toBN(this.data.balance).toString()),
			available: this.bigNumberService.make(Web3.utils.toBN(this.data.balance).toString()),
			fees: this.bigNumberService.make(Web3.utils.toBN(this.data.balance).toString()),
		};
	}

	public override nonce(): number {
		return Number(Web3.utils.toBN(this.data.nonce).toString());
	}
}
