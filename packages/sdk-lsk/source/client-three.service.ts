import { getAddressFromBase32Address, getLisk32AddressFromAddress } from "@liskhq/lisk-cryptography";
import { getBytes } from "@liskhq/lisk-transactions-beta";
import { Collections, Contracts, Helpers, IoC, Services } from "@payvo/sdk";
import { convertString, convertStringList, joinModuleAndAssetIds } from "./multi-signature.domain";

@IoC.injectable()
export class ClientService extends Services.AbstractClientService {
	#peer!: string;

	@IoC.inject(IoC.BindingType.BigNumberService)
	protected readonly bigNumberService!: Services.BigNumberService;

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#peer = `${Helpers.randomHostFromConfig(this.configRepository, "archival")}/api/v2`;
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

	public override async wallet(id: string): Promise<Contracts.WalletData> {
		return this.dataTransferObjectService.wallet((await this.#get("accounts", { address: id })).data[0]);
	}

	public override async wallets(query: Services.ClientWalletsInput): Promise<Collections.WalletDataCollection> {
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
			votes: data.votes.map(({ address, amount }) => ({
				id: address,
				amount: this.bigNumberService.make(amount).toHuman(),
			})),
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

		const assets = this.configRepository.get<object>("network.meta.assets");
		for (const transaction of transactions) {
			const { assetSchema } = assets[{
				"2:0": "token:transfer",
				"4:0": "keys:registerMultisignatureGroup",
				"5:0": "dpos:registerDelegate",
				"5:1": "dpos:voteDelegate",
				"5:2": "dpos:unlockToken",
				"5:3": "dpos:reportDelegateMisbehavior",
				"1000:0": "legacyAccount:reclaimLSK",
			}[joinModuleAndAssetIds(transaction.data())]!];

			// @TODO
			const tx = transaction.toBroadcast();
			tx.fee = BigInt(tx.fee);
			tx.nonce = BigInt(tx.nonce);
			tx.id = convertString(tx.id);
			tx.senderPublicKey = convertString(tx.senderPublicKey);
			tx.asset.amount = BigInt(tx.asset.amount);
			tx.asset.recipientAddress = getAddressFromBase32Address(
				getLisk32AddressFromAddress(Buffer.from(tx.asset.recipientAddress, "hex"))
			);
			tx.signatures = convertStringList(tx.signatures);

			console.log(tx)

			const { transactionId, message } = await this.#post("transactions", {
				transaction: getBytes(assetSchema, tx).toString("hex"),
			});

			if (transactionId) {
				result.accepted.push(transaction.id());

				continue;
			}

			if (message) {
				result.rejected.push(transaction.id());

				result.errors[transaction.id()] = message;
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
		if (searchParams.addresses) {
			// @ts-ignore - This field doesn't exist on the interface but are needed.
			searchParams.address = searchParams.addresses[0];
			delete searchParams.addresses;
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
