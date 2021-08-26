import { Http } from "@payvo/sdk";
import { BigNumber } from "@payvo/helpers";

import { UnspentTransaction } from "./contracts";

export class UnspentAggregator {
	readonly #http: Http.HttpClient;
	readonly #peer: string;

	public constructor({ http, peer }) {
		this.#http = http;
		this.#peer = peer;
	}

	public async aggregate(address: string): Promise<UnspentTransaction[]> {
		const response = (
			await this.#http.post(`${this.#peer}/wallets/transactions/unspent`, {
				addresses: [address],
			})
		).json();

		return response.data;
	}
}
