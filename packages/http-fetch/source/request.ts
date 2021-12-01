/* eslint-disable import/order */

import { Http } from "@payvo/sdk";
import fetch from "cross-fetch";
import { stringify } from "query-string";

/**
 * Implements HTTP communication through lquixada/cross-fetch.
 *
 * @see https://github.com/lquixada/cross-fetch
 *
 * @export
 * @class Request
 * @extends {Request}
 */
export class Request extends Http.AbstractRequest {
	/** {@inheritDoc Request.send} */
	protected async send(
		method: string,
		url: string,
		data?: { query?: object; data?: any },
	): Promise<Http.HttpResponse> {
		if (data?.query && Object.keys(data?.query).length > 0) {
			url = `${url}?${stringify(data.query)}`;
		}

		let response;

		if (method === "GET") {
			response = await fetch(url, {
				...this._options,
				mode: "cors",
			});
		}

		if (method === "POST") {
			response = await fetch(url, {
				...this._options,
				body: JSON.stringify(data?.data),
				method: "POST",
				mode: "cors",
			});
		}

		if (!response) {
			throw new Error("Received no response. This looks like a bug.");
		}

		return new Http.Response({
			body: await response.text(),
			headers: response.headers,
			statusCode: response.status,
		});
	}
}
