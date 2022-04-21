import { Collections, Contracts, Helpers, IoC, Services } from "@payvo/sdk";

export class ClientService extends Services.AbstractClientService {
	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		const response = await this.#get(`txs/${id}`);

		return this.dataTransferObjectService.transaction(response);
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		const page = Number(query.cursor || 1);

		const response = await this.#get("txs", {
			limit: query.limit || 100,
			"message.action": "send",
			"message.sender": query.identifiers![0].value,
			page,
		});

		return this.dataTransferObjectService.transactions(response.txs, {
			last: response.page_total,
			next: page >= Number(response.page_total) ? undefined : page,
			prev: page <= 1 ? undefined : page - 1,
			self: Number(response.page_number),
		});
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		const { result: details } = await this.#get(`auth/accounts/${id.value}`);
		const { result: balance } = await this.#get(`bank/balances/${id.value}`);

		return this.dataTransferObjectService.wallet({
			address: details.value.address,
			balance: Object.values(balance).find(({ denom }: any) => denom === "uatom"),
			publicKey: details.value.public_key.value,
			sequence: details.value.sequence,
		});
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
			const { logs, txhash } = await this.#post("txs", { mode: "block", tx: transaction });

			transaction.setAttributes({ identifier: txhash });

			if (logs[0].success === true) {
				result.accepted.push(txhash);
			} else {
				const { message } = JSON.parse(logs[0].log);

				if (message) {
					result.rejected.push(txhash);

					result.errors[txhash] = message;
				}
			}
		}

		return result;
	}

	async #get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.httpClient.get(`${this.hostSelector(this.configRepository).host}/${path}`, query);

		return response.json();
	}

	async #post(path: string, body: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.httpClient.post(`${this.hostSelector(this.configRepository).host}/${path}`, body);

		return response.json();
	}
}
