/* istanbul ignore file */

import {
	BroadcastResponse,
	ClientService,
	ClientTransactionsInput,
	ClientWalletsInput,
	TransactionDetailInput,
	UnlockTokenResponse,
	VoteReport,
	WalletIdentifier,
} from "./client.contract.js";
import { ConfigRepository } from "./coins.js";
import { ConfirmedTransactionDataCollection, WalletDataCollection } from "./collections.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.contract.js";
import { IContainer } from "./container.contracts.js";
import { KeyValuePair, SignedTransactionData, WalletData } from "./contracts.js";
import { DataTransferObjectService } from "./data-transfer-object.contract.js";
import { NotImplemented } from "./exceptions.js";
import { HttpClient } from "./http.js";
import { NetworkHostSelector } from "./network.models.js";
import { BindingType } from "./service-provider.contract.js";

export class AbstractClientService implements ClientService {
	protected readonly configRepository: ConfigRepository;
	protected readonly dataTransferObjectService: DataTransferObjectService;
	protected readonly httpClient: HttpClient;
	protected readonly hostSelector: NetworkHostSelector;

	public constructor(container: IContainer) {
		this.configRepository = container.get(BindingType.ConfigRepository);
		this.dataTransferObjectService = container.get(BindingType.DataTransferObjectService);
		this.httpClient = container.get(BindingType.HttpClient);
		this.hostSelector = container.get(BindingType.NetworkHostSelector);
	}

	public async transaction(id: string, input?: TransactionDetailInput): Promise<ConfirmedTransactionData> {
		throw new NotImplemented(this.constructor.name, this.transaction.name);
	}

	public async transactions(query: ClientTransactionsInput): Promise<ConfirmedTransactionDataCollection> {
		throw new NotImplemented(this.constructor.name, this.transactions.name);
	}

	public async wallet(id: WalletIdentifier): Promise<WalletData> {
		throw new NotImplemented(this.constructor.name, this.wallet.name);
	}

	public async wallets(query: ClientWalletsInput): Promise<WalletDataCollection> {
		throw new NotImplemented(this.constructor.name, this.wallets.name);
	}

	public async delegate(id: string): Promise<WalletData> {
		throw new NotImplemented(this.constructor.name, this.delegate.name);
	}

	public async delegates(query?: KeyValuePair): Promise<WalletDataCollection> {
		throw new NotImplemented(this.constructor.name, this.delegates.name);
	}

	public async votes(id: string): Promise<VoteReport> {
		throw new NotImplemented(this.constructor.name, this.votes.name);
	}

	public async voters(id: string, query?: KeyValuePair): Promise<WalletDataCollection> {
		throw new NotImplemented(this.constructor.name, this.voters.name);
	}

	public async unlockableBalances(id: string): Promise<UnlockTokenResponse> {
		throw new NotImplemented(this.constructor.name, this.unlockableBalances.name);
	}

	public async broadcast(transactions: SignedTransactionData[]): Promise<BroadcastResponse> {
		throw new NotImplemented(this.constructor.name, this.broadcast.name);
	}
}
