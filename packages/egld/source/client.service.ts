import { Collections, Contracts, Helpers, Services } from "@payvo/sdk";

export class ClientService extends Services.AbstractClientService {
	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		const { data } = await this.#get(`transaction/${id}`);

		return this.dataTransferObjectService.transaction({ hash: id, ...data.transaction });
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		const { data } = await this.#get(`address/${Helpers.pluckAddress(query)}/transactions`);

		return this.dataTransferObjectService.transactions(data.transactions, {
			last: undefined,
			next: undefined,
			prev: undefined,
			self: undefined,
		});
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		const { data } = await this.#get(`address/${id.value}`);

		return this.dataTransferObjectService.wallet(data.account);
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
				const { txHash } = await this.#post("transaction/send", transaction.toBroadcast());

				transaction.setAttributes({ identifier: txHash });

				result.accepted.push(transaction.id());
			} catch (error) {
				result.rejected.push(transaction.id());

				result.errors[transaction.id()] = (error as any).message;
			}
		}

		return result;
	}

	async #get(path: string): Promise<Contracts.KeyValuePair> {
		return (await this.httpClient.get(`${this.#host()}/v1.0/${path}`)).json();
	}

	async #post(path: string, data: object): Promise<Contracts.KeyValuePair> {
		return (await this.httpClient.post(`${this.#host()}/v1.0/${path}`, data)).json();
	}

	#host(): string {
		return this.hostSelector(this.configRepository).host;
	}
}
