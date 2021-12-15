/* istanbul ignore file */

import { BigNumber } from "@payvo/sdk-helpers";

import { BigNumberService } from "./big-number.service.js";
import { IContainer } from "./container.contracts.js";
import { KeyValuePair, WalletBalance, WalletMultiSignature } from "./contracts.js";
import { NotImplemented } from "./exceptions.js";
import { BindingType } from "./service-provider.contract.js";

export class AbstractWalletData {
	protected readonly bigNumberService: BigNumberService;
	protected data!: KeyValuePair;

	public constructor(container: IContainer) {
		this.bigNumberService = container.get(BindingType.BigNumberService);
	}

	public fill(data: KeyValuePair) {
		this.data = data;

		return this;
	}

	// Wallet
	public primaryKey(): string {
		throw new NotImplemented(this.constructor.name, this.primaryKey.name);
	}

	public address(): string {
		throw new NotImplemented(this.constructor.name, this.address.name);
	}

	public publicKey(): string | undefined {
		return undefined;
	}

	public balance(): WalletBalance {
		throw new NotImplemented(this.constructor.name, this.balance.name);
	}

	public nonce(): BigNumber {
		return BigNumber.ZERO;
	}

	// Second Signature
	public secondPublicKey(): string | undefined {
		return undefined;
	}

	// Delegate
	public username(): string | undefined {
		return undefined;
	}

	public rank(): number | undefined {
		return undefined;
	}

	public votes(): BigNumber | undefined {
		return undefined;
	}

	// Musig
	public multiSignature(): WalletMultiSignature {
		throw new NotImplemented(this.constructor.name, this.multiSignature.name);
	}

	// Flags
	public isDelegate(): boolean {
		return false;
	}

	public isResignedDelegate(): boolean {
		return false;
	}

	public isMultiSignature(): boolean {
		return false;
	}

	public isSecondSignature(): boolean {
		return false;
	}

	public toObject(): KeyValuePair {
		return {
			address: this.address(),
			balance: this.balance(),
			isDelegate: this.isDelegate(),
			isMultiSignature: this.isMultiSignature(),
			isResignedDelegate: this.isResignedDelegate(),
			isSecondSignature: this.isSecondSignature(),
			nonce: this.nonce(),
			publicKey: this.publicKey(),
			rank: this.rank(),
			username: this.username(),
			votes: this.votes(),
		};
	}

	public toHuman(): KeyValuePair {
		const { available, fees, locked, tokens } = this.balance();

		const balance: {
			available: number;
			fees: number;
			locked?: number | undefined;
			tokens?: Record<string, number> | undefined;
		} = {
			available: available.toHuman(),
			fees: fees.toHuman(),
			locked: undefined,
			tokens: undefined,
		};

		if (locked) {
			balance.locked = locked.toHuman();
		}

		if (tokens) {
			balance.tokens = {};

			for (const [key, value] of Object.entries(tokens)) {
				balance.tokens[key] = value.toHuman();
			}
		}

		return {
			...this.toObject(),
			balance,
		};
	}

	public raw(): KeyValuePair {
		return this.data;
	}

	public hasPassed(): boolean {
		return Object.keys(this.data).length > 0;
	}

	public hasFailed(): boolean {
		return !this.hasPassed();
	}
}
