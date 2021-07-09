import { Coins, Contracts, IoC, Services } from "@payvo/sdk";

import { BindingType } from "./coin.contract";
import { TransactionServiceTwo } from "./transaction-two.service";
import { TransactionServiceThree } from "./transaction-three.service";
import { isTest } from "./helpers";

@IoC.injectable()
export class TransactionService extends Services.AbstractTransactionService {
	@IoC.inject(BindingType.TransactionServiceTwo)
	private readonly two!: TransactionServiceTwo;

	@IoC.inject(BindingType.TransactionServiceThree)
	private readonly three!: TransactionServiceThree;

	/**
	 * @inheritDoc
	 *
	 * @ledgerX
	 * @ledgerS
	 */
	public override async transfer(input: Services.TransferInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("transfer", input);
	}

	public override async secondSignature(
		input: Services.SecondSignatureInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("secondSignature", input);
	}

	public override async delegateRegistration(
		input: Services.DelegateRegistrationInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("delegateRegistration", input);
	}

	/**
	 * @inheritDoc
	 *
	 * @ledgerX
	 * @ledgerS
	 */
	public override async vote(input: Services.VoteInput): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("vote", input);
	}

	public override async multiSignature(
		input: Services.MultiSignatureInput,
	): Promise<Contracts.SignedTransactionData> {
		return this.#createFromData("multiSignature", input);
	}

	async #createFromData(method: string, input: object): Promise<Contracts.SignedTransactionData> {
		if (isTest(this.configRepository)) {
			return this.three[method](input);
		}

		return this.two[method](input);
	}
}
