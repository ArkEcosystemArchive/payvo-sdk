import { Contracts, DTO } from "@payvo/sdk";
import { BigNumber } from "@payvo/helpers";

export class WalletData extends DTO.AbstractWalletData implements Contracts.WalletData {
	public override primaryKey(): string {
		return this.address();
	}

	public override address(): string {
		return this.data.address;
	}

	public override publicKey(): string | undefined {
		return this.data.publicKey;
	}

	public override balance(): Contracts.WalletBalance {
		return {
			total: this.bigNumberService.make(this.data.balance),
			available: this.bigNumberService.make(this.data.balance),
			fees: this.bigNumberService.make(this.data.balance),
		};
	}

	public override nonce(): BigNumber {
		return BigNumber.ZERO;
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
		throw new Error("This wallet does not have a multi-signature registered.");
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
