import { Collections, Contracts, IoC, Services } from "@payvo/sdk";
import { DateTime } from "@payvo/sdk-intl";

import { calculateUnlockableBalance, calculateUnlockableBalanceInTheFuture, isBlockHeightReached } from "./helpers.js";
import { TransactionSerializer } from "./transaction.serializer.js";

export class ClientService extends Services.AbstractClientService {
	readonly #bigNumberService: Services.BigNumberService;
	readonly #broadcastSerializer: IoC.Factory<TransactionSerializer>;
	#peer!: string;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#bigNumberService = container.get(IoC.BindingType.BigNumberService);
		this.#broadcastSerializer = container.factory(TransactionSerializer);
		this.#peer = this.hostSelector(this.configRepository, "full").host;
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
				// @ts-ignore - This field doesn't exist on the interface but is needed.
				query.publicKey = query.identifiers[0].value;
			} else {
				// @ts-ignore - This field doesn't exist on the interface but is needed.
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
			available: 20 - data.account.votesUsed,
			used: data.account.votesUsed,
			votes: (data.votes ?? []).map(({ address, amount }) => ({
				amount: this.#bigNumberService.make(amount).toHuman(),
				id: address,
			})),
		};
	}

	public override async unlockableBalances(id: string): Promise<Services.UnlockTokenResponse> {
		const { unlocking = [] } = (await this.#get("accounts", { address: id })).data[0].dpos;
		const { blockTime, height: currentBlockHeight } = (await this.#get("network/status")).data;

		const getPendingTime = (unvoteHeight: number, unlockHeight: number, blockTime: number): DateTime =>
			DateTime.make().setSecond((unlockHeight - unvoteHeight) * blockTime);

		return {
			current: this.#bigNumberService.make(calculateUnlockableBalance(unlocking, currentBlockHeight)),
			objects: unlocking.map(({ amount, delegateAddress, height }) => ({
				address: delegateAddress,
				amount: this.#bigNumberService.make(amount),
				height: Number(height.start),
				isReady: isBlockHeightReached(height.end, currentBlockHeight),
				timestamp: getPendingTime(currentBlockHeight, height.end, blockTime),
			})),
			pending: this.#bigNumberService.make(calculateUnlockableBalanceInTheFuture(unlocking, currentBlockHeight)),
		};
	}

	public override async broadcast(
		transactions: Contracts.SignedTransactionData[],
	): Promise<Services.BroadcastResponse> {
		const result: Services.BroadcastResponse = {
			accepted: [],
			errors: {},
			rejected: [],
		};

		for (const transaction of transactions) {
			try {
				const { transactionId, message } = await this.#post("transactions", {
					transaction: this.#broadcastSerializer().toString(transaction.toBroadcast()),
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
				const { message } = (error as any).response.json();

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

	#createSearchParams(searchParameters: Services.ClientTransactionsInput): object {
		if (searchParameters.cursor) {
			// @ts-ignore
			searchParameters.offset = searchParameters.cursor - 1;

			delete searchParameters.cursor;
		}

		// LSK doesn't support bulk lookups so we will simply use the first address.
		if (searchParameters.identifiers) {
			const value = searchParameters.identifiers[0].value;

			if (!searchParameters.type || searchParameters.type === "transfer") {
				// @ts-ignore - This field doesn't exist on the interface but is needed.
				searchParameters.address = value;
			} else {
				// @ts-ignore - This field doesn't exist on the interface but is needed.
				searchParameters.senderAddress = value;
			}

			delete searchParameters.identifiers;
		}

		if (searchParameters.senderId) {
			// @ts-ignore - This field doesn't exist on the interface but is needed.
			searchParameters.senderAddress = searchParameters.senderId;

			delete searchParameters.senderId;
		}

		if (searchParameters.recipientId) {
			// @ts-ignore - This field doesn't exist on the interface but is needed.
			searchParameters.recipientAddress = searchParameters.recipientId;

			delete searchParameters.recipientId;
		}

		if (searchParameters.type) {
			const moduleAssetId: string | undefined = {
				delegateRegistration: "5:0",
				multiSignature: "4:0",
				transfer: "2:0",
				unlockToken: "5:2",
				vote: "5:1",
			}[searchParameters.type];

			// @ts-ignore - This field doesn't exist on the interface but is needed.
			searchParameters.moduleAssetId = moduleAssetId || "0:0";

			delete searchParameters.type;
		}

		return searchParameters;
	}

	#createPagination(data, meta): Services.MetaPagination {
		const hasPreviousPage: boolean = data && data.length === meta.count && meta.offset !== 0;
		const hasNextPage: boolean = meta.count + meta.offset !== meta.total;

		return {
			last: undefined,
			next: hasNextPage ? Number(meta.offset) + Number(meta.count) : undefined,
			prev: hasPreviousPage ? Number(meta.offset) - Number(meta.count) : undefined,
			self: meta.offset,
		};
	}
}
