import { Collections, Contracts, IoC, Services } from "@payvo/sdk";

import { BindingType } from "./coin.contract";
import { ClientServiceThree } from "./client-three.service";
import { ClientServiceTwo } from "./client-two.service";
import { isTest } from "./helpers";

@IoC.injectable()
export class ClientService extends Services.AbstractClientService {
	@IoC.inject(BindingType.ClientServiceTwo)
	private readonly two!: ClientServiceTwo;

	@IoC.inject(BindingType.ClientServiceThree)
	private readonly three!: ClientServiceThree;

	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		if (isTest(this.configRepository)) {
			return this.three.transaction(id, input);
		}

		return this.two.transaction(id, input);
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		if (isTest(this.configRepository)) {
			return this.three.transactions(query);
		}

		return this.two.transactions(query);
	}

	public override async wallet(id: string): Promise<Contracts.WalletData> {
		if (isTest(this.configRepository)) {
			return this.three.wallet(id);
		}

		return this.two.wallet(id);
	}

	public override async wallets(query: Services.ClientWalletsInput): Promise<Collections.WalletDataCollection> {
		if (isTest(this.configRepository)) {
			return this.three.wallets(query);
		}

		return this.two.wallets(query);
	}

	public override async delegate(id: string): Promise<Contracts.WalletData> {
		if (isTest(this.configRepository)) {
			return this.three.delegate(id);
		}

		return this.two.delegate(id);
	}

	public override async delegates(query?: any): Promise<Collections.WalletDataCollection> {
		if (isTest(this.configRepository)) {
			return this.three.delegates(query);
		}

		return this.two.delegates(query);
	}

	public override async votes(id: string): Promise<Services.VoteReport> {
		if (isTest(this.configRepository)) {
			return this.three.votes(id);
		}

		return this.two.votes(id);
	}

	public override async broadcast(
		transactions: Contracts.SignedTransactionData[],
	): Promise<Services.BroadcastResponse> {
		if (isTest(this.configRepository)) {
			return this.three.broadcast(transactions);
		}

		return this.two.broadcast(transactions);
	}
}
