import { Coins, Exceptions, Http, Networks } from "@payvo/sdk";
import { SignedBlock } from "nanocurrency-web/dist/lib/block-signer";

interface AccountInfoResponse {
	frontier: string;
	open_block: string;
	representative_block: string;
	balance: string;
	modified_timestamp: string;
	block_count: string;
	account_version: string;
	confirmation_height: string;
	confirmation_height_frontier: string;
	representative: string;
	pending: string;
}

interface AccountHistory {
	type: string;
	account: string;
	amount: string;
	local_timestamp: string;
	height: string;
	hash: string;
}

interface AccountHistoryResponse {
	account: string;
	history: AccountHistory[];
	previous: string;
}

export class NanoClient {
	readonly #config: Coins.ConfigRepository;
	readonly #http: Http.HttpClient;
	readonly #hostSelector: Networks.NetworkHostSelector;

	public constructor(
		config: Coins.ConfigRepository,
		httpClient: Http.HttpClient,
		hostSelector: Networks.NetworkHostSelector,
	) {
		this.#config = config;
		this.#http = httpClient;
		this.#hostSelector = hostSelector;
	}

	public async accountBalance(account: string): Promise<{ balance: string; pending: string }> {
		return this.#post("account_balance", { account });
	}

	public async accountInfo(
		account: string,
		options?: { representative?: boolean; pending?: boolean },
	): Promise<AccountInfoResponse> {
		return this.#post("account_info", { account, ...options });
	}

	public async accountHistory(
		account: string,
		count: string,
		options?: { head?: string | number },
	): Promise<AccountHistoryResponse> {
		return this.#post("account_history", { account, count, ...options });
	}

	public async process(
		subtype: "send" | "receive" | "open" | "change" | "epoch",
		block: SignedBlock,
	): Promise<{ hash: string }> {
		return this.#post("process", { block, json_block: "true", subtype });
	}

	async #post<T = Record<string, any>>(action: string, parameters: Record<string, unknown>): Promise<T> {
		const result = (await this.#http.post(this.#hostSelector(this.#config).host, { action, ...parameters })).json();

		if (result.error) {
			throw new Exceptions.Exception(`RPC error: ${JSON.stringify(result.error)}`);
		}

		return result as T;
	}
}
