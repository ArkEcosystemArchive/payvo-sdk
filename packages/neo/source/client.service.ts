import { Collections, Contracts, IoC, Networks, Services } from "@payvo/sdk";
import Neon, { api } from "@cityofzion/neon-js";

export class ClientService extends Services.AbstractClientService {
	#peer!: string;
	#apiProvider;

	public constructor(container: IoC.IContainer) {
		super(container);

		const network: string = this.configRepository.get<Networks.NetworkManifest>("network").id.split(".")[1];

		this.#peer = {
			mainnet: "https://api.neoscan.io/api/main_net/v1",
			testnet: "https://neoscan-testnet.io/api/test_net/v1",
		}[network]!;

		this.#apiProvider = new api.neoscan.instance(network === "mainnet" ? "MainNet" : "TestNet");
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		const basePath = `get_address_abstracts/${query.identifiers![0].value}`;
		const basePage = (query.cursor as number) || 1;

		const response = await this.#get(`${basePath}/${basePage}`);

		const prevPage = response.page_number > 1 ? basePage - 1 : undefined;
		const nextPage = response.total_pages > 1 ? basePage + 1 : undefined;

		return this.dataTransferObjectService.transactions(response.entries, {
			prev: `${this.#peer}/${basePath}/${prevPage}`,
			self: undefined,
			next: `${this.#peer}/${basePath}/${nextPage}`,
			last: response.total_pages,
		});
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		const response = await this.#get(`get_balance/${id.value}`);

		return this.dataTransferObjectService.wallet({
			address: id.value,
			balance: response.balance,
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
			try {
				const { response } = await Neon.sendAsset({
					account: transaction.get("account"),
					api: this.#apiProvider,
					intents: transaction.get("intents"),
				});

				if (response === undefined) {
					result.rejected.push(transaction.id());

					continue;
				}

				if (response.txid) {
					transaction.setAttributes({ identifier: response.txid });

					result.accepted.push(transaction.id());
				}
			} catch (error) {
				result.rejected.push(transaction.id());

				result.errors[transaction.id()] = error.message;
			}
		}

		return result;
	}

	async #get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.httpClient.get(`${this.#peer}/${path}`, query);

		return response.json();
	}
}
