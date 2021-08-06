import { Collections, Contracts, Helpers, IoC, Services } from "@payvo/sdk";

@IoC.injectable()
export class ClientService extends Services.AbstractClientService {
	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		const response = await this.#get(`transactions/${id}`);
		return this.dataTransferObjectService.transaction(response.data);
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		if (!query.identifiers) {
			throw new Error("No identifiers specified for querying for transactions");
		}

		const response = await this.#post("wallets/transactions", {
			addresses: query.identifiers.map(({ value }) => value),
		});

		return this.dataTransferObjectService.transactions(response.data, this.#createMetaPagination(response));
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		const response = await this.#post(`wallets`, { addresses: [id.value] });
		return this.dataTransferObjectService.wallet(response.data);
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
			const transactionId: string = transaction.id(); // todo: get the transaction ID

			if (!transactionId) {
				throw new Error("Failed to compute the transaction ID.");
			}

			const response = (await this.#post("transactions", { transactions: [transaction.toBroadcast()] })).data;

			if (response.result) {
				result.accepted.push(transactionId);
			}

			if (response.error) {
				result.rejected.push(transactionId);

				result.errors[transactionId] = response.error.message;
			}
		}

		return result;
	}

	async #get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.httpClient.get(
			`${Helpers.randomHostFromConfig(this.configRepository)}/${path}`,
			query,
		);

		return response.json();
	}

	async #post(path: string, body: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.httpClient.post(
			`${Helpers.randomHostFromConfig(this.configRepository)}/${path}`,
			body,
		);

		return response.json();
	}

	#createMetaPagination(body): Services.MetaPagination {
		const getPage = (url: string): string | undefined => {
			const match: RegExpExecArray | null = RegExp(/page=(\d+)/).exec(url);

			return match ? match[1] || undefined : undefined;
		};

		return {
			prev: getPage(body.links.prev) || undefined,
			next: getPage(body.links.next) || undefined,
			self: body.meta.current_page || undefined,
			last: body.meta.last_page || undefined,
		};
	}
}
