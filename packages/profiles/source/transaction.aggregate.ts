import { Collections, Services } from "@payvo/sdk";

import { IProfile, IReadWriteWallet, ITransactionAggregate } from "./contracts.js";
import { promiseAllSettledByKey } from "./helpers/promise.js";
import { AggregateQuery } from "./transaction.aggregate.contract.js";
import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection.js";
import { ExtendedConfirmedTransactionData } from "./transaction.dto.js";

type HistoryMethod = string;
type HistoryWallet = ExtendedConfirmedTransactionDataCollection;

export class TransactionAggregate implements ITransactionAggregate {
	readonly #profile: IProfile;
	#history: Record<HistoryMethod, Record<string, HistoryWallet>> = {};

	public constructor(profile: IProfile) {
		this.#profile = profile;
	}

	/** {@inheritDoc ITransactionAggregate.all} */
	public async all(query: AggregateQuery = {}): Promise<ExtendedConfirmedTransactionDataCollection> {
		return this.#aggregate("all", query);
	}

	/** {@inheritDoc ITransactionAggregate.sent} */
	public async sent(query: AggregateQuery = {}): Promise<ExtendedConfirmedTransactionDataCollection> {
		return this.#aggregate("sent", query);
	}

	/** {@inheritDoc ITransactionAggregate.received} */
	public async received(query: AggregateQuery = {}): Promise<ExtendedConfirmedTransactionDataCollection> {
		return this.#aggregate("received", query);
	}

	/** {@inheritDoc ITransactionAggregate.hasMore} */
	public hasMore(method: string): boolean {
		return Object.values(this.#history[method] || {})
			.map((response) => response.hasMorePages())
			.includes(true);
	}

	/** {@inheritDoc ITransactionAggregate.flush} */
	public flush(method?: string): void {
		if (method) {
			this.#history[method] = {};
			return;
		}

		this.#history = {};
	}

	async #aggregate(method: string, query: AggregateQuery): Promise<ExtendedConfirmedTransactionDataCollection> {
		if (!this.#history[method]) {
			this.#history[method] = {};
		}

		const syncedWallets: IReadWriteWallet[] = this.#getWallets(query.identifiers);
		const requests: Record<string, Promise<Collections.ConfirmedTransactionDataCollection>> = {};

		delete query.identifiers;

		for (const syncedWallet of syncedWallets) {
			requests[syncedWallet.id()] = new Promise((resolve, reject) => {
				const lastResponse: HistoryWallet = this.#history[method][syncedWallet.id()];

				if (lastResponse && !lastResponse.hasMorePages()) {
					return reject(
						`Fetched all transactions for ${syncedWallet.id()}. Call [#flush] if you want to reset the history.`,
					);
				}

				if (lastResponse && lastResponse.hasMorePages()) {
					return resolve(
						syncedWallet.transactionIndex()[method]({ cursor: lastResponse.nextPage(), ...query }),
					);
				}

				return resolve(syncedWallet.transactionIndex()[method](query));
			});
		}

		const responses = await promiseAllSettledByKey<ExtendedConfirmedTransactionDataCollection>(requests);
		const result: ExtendedConfirmedTransactionData[] = [];

		for (const [id, request] of Object.entries(responses || {})) {
			if (request.status === "rejected" || request.value instanceof Error) {
				continue;
			}

			if (request.value.isEmpty()) {
				continue;
			}

			for (const transaction of request.value.items()) {
				result.push(transaction);
			}

			this.#history[method][id] = request.value;
		}

		return new ExtendedConfirmedTransactionDataCollection(result, {
			last: undefined,
			next: Number(this.hasMore(method)),
			prev: undefined,
			self: undefined,
		});
	}

	#getWallets(identifiers: Services.WalletIdentifier[] = []): IReadWriteWallet[] {
		return this.#profile
			.wallets()
			.values()
			.filter((wallet: IReadWriteWallet) => {
				const match =
					identifiers.length === 0 ||
					identifiers.some(({ type, value, networkId }: Services.WalletIdentifier) => {
						const networkMatch = networkId ? networkId === wallet.networkId() : true;

						if (type === "address") {
							return networkMatch && value === wallet.address();
						}

						/* istanbul ignore else */
						if (type === "extendedPublicKey") {
							return networkMatch && value === wallet.publicKey();
						}

						/* istanbul ignore next */
						return false;
					});
				return match && wallet.hasSyncedWithNetwork();
			});
	}
}
