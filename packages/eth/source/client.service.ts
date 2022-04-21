import { Collections, Contracts, IoC, Services } from "@payvo/sdk";
import { Hash } from "@payvo/sdk-cryptography";

export class ClientService extends Services.AbstractClientService {
	readonly #peer: string;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#peer = this.hostSelector(this.configRepository).host;
	}

	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		return this.dataTransferObjectService.transaction(await this.#get(`transactions/${id}`));
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		const response: any = await this.#get(`wallets/${query.identifiers![0].value}/transactions`);
		const transactions: unknown[] = response.data;

		return this.dataTransferObjectService.transactions(transactions, this.#createMetaPagination(response));
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		return this.dataTransferObjectService.wallet(await this.#get(`wallets/${id.value}`));
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
			const transactionId: string = Hash.sha3(transaction.toBroadcast()).toString("hex");

			if (!transactionId) {
				throw new Error("Failed to compute the transaction ID.");
			}

			transaction.setAttributes({ identifier: transactionId });

			const response = await this.#post("transactions", {
				transaction: transaction.toBroadcast(),
			});

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
		return (await this.httpClient.get(`${this.#peer}/${path}`, query)).json();
	}

	async #post(path: string, body: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return (await this.httpClient.post(`${this.#peer}/${path}`, body)).json();
	}

	#createMetaPagination(body): Services.MetaPagination {
		const getPage = (url: string): string | undefined => {
			const match: RegExpExecArray | null = new RegExp(/page=(\d+)/).exec(url);

			return match ? match[1] || undefined : undefined;
		};

		return {
			last: body.meta.last_page || undefined,
			next: getPage(body.links.next) || undefined,
			prev: getPage(body.links.prev) || undefined,
			self: body.meta.current_page || undefined,
		};
	}
}
