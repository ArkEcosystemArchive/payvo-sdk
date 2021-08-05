import { Collections, Contracts, Helpers, IoC, Services } from "@payvo/sdk";
import { getNetworkConfig } from "./config";
import { addressGenerator, bip44, bip49, bip84 } from "./address.domain";

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
		if (!query.addresses && !query.senderPublicKey) {
			throw new Error("Need specify either addresses or a extended public key for querying for transactions");
		}

		let addresses = query.addresses;
		if (!addresses) {
			const network = getNetworkConfig(this.configRepository);

			const bip = bip44; // TODO Make this a method param or part of the ClientTransactionsInput

			const xpub = query.senderPublicKey!;
			addresses = (await this.usedAddresses(addressGenerator(bip, network, xpub, true, 100))).concat(
				await this.usedAddresses(addressGenerator(bip, network, xpub, false, 100)),
			);
		}

		const response = await this.#post("wallets/transactions", { addresses });

		return this.dataTransferObjectService.transactions(response.data, this.#createMetaPagination(response));
	}

	public override async wallet(xpub: string): Promise<Contracts.WalletData> {
		const network = getNetworkConfig(this.configRepository);

		const bip = bip44; // TODO Make this a method param

		const usedSpendAddresses = await this.usedAddresses(addressGenerator(bip, network, xpub, true, 100));
		const usedChangeAddresses = await this.usedAddresses(addressGenerator(bip, network, xpub, false, 100));

		const response = await this.#post(`wallets`, { addresses: usedSpendAddresses.concat(usedChangeAddresses) });
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

	private async walletUsedTransactions(addresses: string[]): Promise<{ string: boolean }[]> {
		const response = await this.#post(`wallets/addresses`, { addresses: addresses });
		return response.data;
	}

	private async usedAddresses(addressesGenerator: Generator<string[]>): Promise<string[]> {
		const usedAddresses: string[] = [];

		let exhausted = false;
		do {
			const addressChunk: string[] = addressesGenerator.next().value;
			const used: { string: boolean }[] = await this.walletUsedTransactions(addressChunk);

			const items = addressChunk.filter((address) => used[address]);
			usedAddresses.push(...items);

			exhausted = Object.values(used)
				.slice(-20)
				.every((x) => !x);
		} while (!exhausted);
		return usedAddresses;
	}
}
