import { Collections, Contracts, Exceptions, Helpers, IoC, Services } from "@payvo/sdk";
import { InvalidArguments } from "@payvo/sdk/distribution/exceptions";
// import { usedAddressesForAccount } from "./transaction.domain";
import * as bitcoin from "bitcoinjs-lib";
import { Buffer } from "buffer";

@IoC.injectable()
export class ClientService extends Services.AbstractClientService {
	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput
	): Promise<Contracts.ConfirmedTransactionData> {
		const response = await this.#get(`transactions/${id}`);
		return this.dataTransferObjectService.transaction(response.data);
	}

	public override async transactions(
		query: Services.ClientTransactionsInput
	): Promise<Collections.ConfirmedTransactionDataCollection> {

		if (query.senderPublicKey === undefined) {
			throw new Exceptions.InvalidArguments(this.constructor.name, this.transactions.name);
		}

		const response = await this.#post("wallets/transactions", { addresses: query.addresses });

		return this.dataTransferObjectService.transactions(response.data, this.#createMetaPagination(response));
	}

	public override async wallet(xpub: string): Promise<Contracts.WalletData> {

		const addressFromAccountExtPublicKey = (
			extPubKey: Buffer,
			isChange: boolean,
			addressIndex: number,
			network: bitcoin.Network
		): string => {
			const node = bitcoin.bip32.fromBase58(xpub, network);
			return bitcoin.payments.p2pkh({
				pubkey: node.derive(addressIndex).publicKey,
				network: network
			}).address!;
		};

		const addressesChunk = async (
			network: bitcoin.Network,
			accountPublicKey: string,
			isChange: boolean,
			offset: number
		): Promise<string[]> => {
			const publicKey = Buffer.from(accountPublicKey, "hex");
			const addresses: string[] = [];
			for (let i = offset; i < offset + 20; ++i) {
				addresses.push(addressFromAccountExtPublicKey(publicKey, isChange, i, network));
			}
			return addresses;
		};

		const usedSpendAddresses: Set<string> = new Set<string>();
		const usedChangeAddresses: Set<string> = new Set<string>();

		let offset = 0;
		let exhausted = false;
		do {
			const spendAddresses: string[] = await addressesChunk(bitcoin.networks.bitcoin, xpub, false, offset);
			const changeAddresses: string[] = await addressesChunk(bitcoin.networks.bitcoin, xpub, true, offset);

			const allAddresses = spendAddresses.concat(changeAddresses);
			const usedAddresses: string[] = allAddresses
				.filter(async a => {
					try {
						const confirmedTransactionData = await this.walletTransactions(a);
						console.log(confirmedTransactionData);
						return confirmedTransactionData.meta.total > 0;
					} catch (error) {
						console.log("fucking error", error);
						throw error;
					}
				});

			spendAddresses
				.filter((sa) => usedAddresses.find((ua) => ua === sa) !== undefined)
				.forEach((sa) => usedSpendAddresses.add(sa));
			changeAddresses
				.filter((sa) => usedAddresses.find((ua) => ua === sa) !== undefined)
				.forEach((sa) => usedChangeAddresses.add(sa));

			exhausted = usedAddresses.length === 0;
			offset += 20;
		} while (!exhausted);
		console.log(usedSpendAddresses, usedChangeAddresses);
		const response = await this.#post(`wallets`, { addresses: [xpub] });
		return this.dataTransferObjectService.wallet(response.data);
	}

	public override async broadcast(
		transactions: Contracts.SignedTransactionData[]
	): Promise<Services.BroadcastResponse> {
		const result: Services.BroadcastResponse = {
			accepted: [],
			rejected: [],
			errors: {}
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
			query
		);

		return response.json();
	}

	async #post(path: string, body: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		const response = await this.httpClient.post(
			`${Helpers.randomHostFromConfig(this.configRepository)}/${path}`,
			body
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
			last: body.meta.last_page || undefined
		};
	}

	private async walletTransactions(address: string) {
		try {
			const response = await this.#post(`wallets/transactions`, { addresses: [address] });
			console.log("response", response);
			return response.data;
		} catch (e) {
			console.log("error", e);
		}
	}
}
