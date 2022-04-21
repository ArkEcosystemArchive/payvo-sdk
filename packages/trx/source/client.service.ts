import { Collections, Contracts, IoC, Services } from "@payvo/sdk";
import TronWeb from "tronweb";

export class ClientService extends Services.AbstractClientService {
	#connection!: TronWeb;
	#peer!: string;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#peer = this.hostSelector(this.configRepository).host;
		this.#connection = new TronWeb({ fullHost: this.#peer });
	}

	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		const result = await this.#connection.trx.getTransaction(id);

		return this.dataTransferObjectService.transaction(result);
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		const payload: Record<string, boolean | number> = {
			limit: query.limit || 15,
		};

		if (query.senderId) {
			payload.only_from = true;
		}

		if (query.recipientId) {
			payload.only_to = true;
		}

		const response = (
			await this.httpClient.get(`${this.#peer}/v1/accounts/${query.identifiers![0].value}/transactions`, payload)
		).json();

		return this.dataTransferObjectService.transactions(
			response.data.filter(({ raw_data }) => raw_data.contract[0].type === "TransferContract"),
			{
				last: undefined,
				next: response.meta.fingerprint,
				prev: undefined,
				self: undefined,
			},
		);
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		const { data } = (await this.httpClient.get(`${this.#getHost()}/v1/accounts/${id.value}`)).json();

		return this.dataTransferObjectService.wallet(data[0]);
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
			const response = (
				await this.httpClient.post(`${this.#getHost()}/wallet/broadcasttransaction`, transaction.toBroadcast())
			).json();

			if (response.result) {
				result.accepted.push(transaction.id());
			}

			if (response.code) {
				result.rejected.push(transaction.id());

				result.errors[transaction.id()] = response.code;
			}
		}

		return result;
	}

	#getHost(): string {
		return this.hostSelector(this.configRepository).host;
	}
}
