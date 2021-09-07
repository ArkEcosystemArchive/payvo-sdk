import { Collections, Contracts, Helpers, IoC, Services } from "@payvo/sdk";
import { TransactionSerializer } from "./transaction.serializer";
import { BindingType } from "./coin.contract";
import { calculateUnlockableBalance, calculateUnlockableBalanceInTheFuture, isBlockHeightReached } from "./helpers";
import { DateTime } from "@payvo/intl";

@IoC.injectable()
export class ClientService extends Services.AbstractClientService {
	#peer!: string;

	@IoC.inject(IoC.BindingType.BigNumberService)
	protected readonly bigNumberService!: Services.BigNumberService;

	@IoC.inject(BindingType.TransactionSerializer)
	protected readonly broadcastSerializer!: TransactionSerializer;

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#peer = Helpers.randomHostFromConfig(this.configRepository, "full");
	}

	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		const result = await this.#get("transactions", { transactionId: id });

		return this.dataTransferObjectService.transaction(result.data[0]);
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		// @ts-ignore
		const result = await this.#get("transactions", this.#createSearchParams({ sort: "timestamp:desc", ...query }));

		return this.dataTransferObjectService.transactions(
			result.data,
			this.#createPagination(result.data, result.meta),
		);
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		return this.dataTransferObjectService.wallet((await this.#get("accounts", { address: id.value })).data[0]);
	}

	public override async wallets(query: Services.ClientWalletsInput): Promise<Collections.WalletDataCollection> {
		// LSK doesn't support bulk lookups so we will simply use the first address.
		if (query.identifiers) {
			if (query.identifiers[0].type === "publicKey") {
				// @ts-ignore - This field doesn't exist on the interface but are needed.
				query.publicKey = query.identifiers[0].value;
			} else {
				// @ts-ignore - This field doesn't exist on the interface but are needed.
				query.address = query.identifiers[0].value;
			}

			delete query.identifiers;
		}

		const result = await this.#get("accounts", query);

		return new Collections.WalletDataCollection(
			result.data.map((wallet) => this.dataTransferObjectService.wallet(wallet)),
			this.#createPagination(result.data, result.meta),
		);
	}

	public override async delegate(id: string): Promise<Contracts.WalletData> {
		const result = await this.#get("accounts", { username: id });

		return this.dataTransferObjectService.wallet(result.data[0]);
	}

	public override async delegates(query?: any): Promise<Collections.WalletDataCollection> {
		const result = await this.#get(
			"accounts",
			this.#createSearchParams({ isDelegate: true, limit: 100, ...query }),
		);

		return new Collections.WalletDataCollection(
			result.data.map((wallet) => this.dataTransferObjectService.wallet(wallet)),
			this.#createPagination(result.data, result.meta),
		);
	}

	public override async votes(id: string): Promise<Services.VoteReport> {
		const { data } = await this.#get("votes_sent", { address: id });

		return {
			used: data.account.votesUsed,
			available: 20 - data.account.votesUsed,
			votes: (data.votes ?? []).map(({ address, amount }) => ({
				id: address,
				amount: this.bigNumberService.make(amount).toHuman(),
			})),
		};
	}

	public override async unlockableBalances(id: string): Promise<Services.UnlockBalanceResponse> {
		const { unlocking } = (await this.#get("accounts", { address: id })).data[0].dpos;
		const { blockTime, height: currentBlockHeight } = (await this.#get("network/status")).data;

		const getPendingTime = (unvoteHeight: number, unlockHeight: number, blockTime: number): DateTime =>
			DateTime.make().setSecond((unlockHeight - unvoteHeight) * blockTime);

		return {
			objects: unlocking.map(({ amount, delegateAddress, height }) => ({
				address: delegateAddress,
				amount: this.bigNumberService.make(amount),
				height: Number(height.start),
				timestamp: getPendingTime(currentBlockHeight, height.end, blockTime),
				isReady: isBlockHeightReached(height.end, currentBlockHeight),
			})),
			current: this.bigNumberService.make(calculateUnlockableBalance(unlocking, currentBlockHeight)),
			pending: this.bigNumberService.make(calculateUnlockableBalanceInTheFuture(unlocking, currentBlockHeight)),
		};
	}

	public override async broadcast(
		transactions: Contracts.SignedTransactionData[],
	): Promise<Services.BroadcastResponse> {
		const result: Services.BroadcastResponse = {
			accepted: [],
			rejected: [],
			errors: {},
		};

		for (const transaction of transactions) {
			try {
				const { transactionId, message } = await this.#post("transactions", {
					transaction: this.broadcastSerializer.toString(transaction.toBroadcast()),
				});

				if (transactionId) {
					result.accepted.push(transaction.id());

					continue;
				}

				if (message) {
					result.rejected.push(transaction.id());

					result.errors[transaction.id()] = message;
				}
			} catch (error) {
				const { message } = (error as any).response.body();

				if (message) {
					result.rejected.push(transaction.id());

					result.errors[transaction.id()] = message;
				}
			}
		}

		return result;
	}

	async #get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return (await this.httpClient.get(`${this.#peer}/${path}`, query)).json();
	}

	async #post(path: string, body: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return (await this.httpClient.post(`${this.#peer}/${path}`, body)).json();
	}

	#createSearchParams(searchParams: Services.ClientTransactionsInput): object {
		if (!searchParams) {
			searchParams = {};
		}

		if (searchParams.cursor) {
			// @ts-ignore
			searchParams.offset = searchParams.cursor - 1;
			delete searchParams.cursor;
		}

		// LSK doesn't support bulk lookups so we will simply use the first address.
		if (searchParams.identifiers) {
			// @ts-ignore - This field doesn't exist on the interface but are needed.
			searchParams.address = searchParams.identifiers[0].value;
			delete searchParams.identifiers;
		}

		return searchParams;
	}

	#createPagination(data, meta): Services.MetaPagination {
		const hasPreviousPage: boolean = data && data.length === meta.limit && meta.offset !== 0;
		const hasNextPage: boolean = data && data.length === meta.limit;

		return {
			prev: hasPreviousPage ? Number(meta.offset) - Number(meta.limit) : undefined,
			self: meta.offset,
			next: hasNextPage ? Number(meta.offset) + Number(meta.limit) : undefined,
			last: undefined,
		};
	}
}
