import { Contracts, DTO, Exceptions } from "@payvo/sdk";
import { BigNumber } from "@payvo/helpers";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.Account;
	}

	public override publicKey(): string | undefined {
		return undefined;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			total: this.bigNumberService.make(this.data.Balance).times(1e8),
			available: this.bigNumberService.make(this.data.Balance).times(1e8),
			fees: this.bigNumberService.make(this.data.Balance).times(1e8),
		};
	}

	public override nonce(): BigNumber {
		return BigNumber.make(this.data.Sequence);
	}

	public override secondPublicKey(): string | undefined {
		return undefined;
	}

	public override username(): string | undefined {
		return undefined;
	}

	public override rank(): number | undefined {
		return undefined;
	}

	public override votes(): BigNumber | undefined {
		return undefined;
	}

	public multiSignature(): Contracts.WalletMultiSignature {
		throw new Exceptions.NotImplemented(this.constructor.name, this.multiSignature.name);
	}

	public override isDelegate(): boolean {
		return false;
	}

	public override isResignedDelegate(): boolean {
		return false;
	}

	public override isMultiSignature(): boolean {
		return false;
	}

	public override isSecondSignature(): boolean {
		return false;
	}
}
