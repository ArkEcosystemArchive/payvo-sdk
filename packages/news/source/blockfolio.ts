import { Http } from "@payvo/sdk";

import { BlockfolioResponse } from "./blockfolio.models";

/**
 * Implements Blockfolio Signal retrieval from the Platform SDK API.
 *
 * @export
 * @class Blockfolio
 */
export class Blockfolio {
	/**
	 * The HTTP client used for communication.
	 *
	 * @type {Http.HttpClient}
	 * @memberof Blockfolio
	 */
	readonly #httpClient: Http.HttpClient;

	/**
	 * Creates an instance of Blockfolio.
	 *
	 * @param {Http.HttpClient} httpClient
	 * @memberof Blockfolio
	 */
	public constructor(httpClient: Http.HttpClient) {
		this.#httpClient = httpClient;
	}

	/**
	 * Retrieves signals for a given coin.
	 *
	 * @param {{
	 * 		page?: number;
	 * 		query?: string;
	 * 		coins: string[];
	 * 		categories?: string[];
	 * 	}} query
	 * @returns {Promise<BlockfolioResponse>}
	 * @memberof Blockfolio
	 */
	public async findByCoin(query: {
		page?: number;
		query?: string;
		coins: string[];
		categories?: string[];
	}): Promise<BlockfolioResponse> {
		const { data, meta } = (await this.#httpClient.get(`https://news.payvo.com/api`, query)).json();

		return { data, meta };
	}
}
