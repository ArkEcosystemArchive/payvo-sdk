import { Contracts, DTO, Exceptions } from "@payvo/sdk";
import { BigNumber } from "@payvo/sdk-helpers";
import Web3 from "web3";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.address;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			total: this.bigNumberService.make(Web3.utils.toBN(this.data.balance).toString()),
			available: this.bigNumberService.make(Web3.utils.toBN(this.data.balance).toString()),
			fees: this.bigNumberService.make(Web3.utils.toBN(this.data.balance).toString()),
		};
	}

	public override nonce(): BigNumber {
		return BigNumber.make(Web3.utils.toBN(this.data.nonce).toString());
	}
}
