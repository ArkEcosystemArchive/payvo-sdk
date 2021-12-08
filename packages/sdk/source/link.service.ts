/* istanbul ignore file */
/* eslint-disable import/order */

import { formatString } from "@payvo/sdk-helpers";
import { URL } from "url";
import queryString from "query-string";

import { ConfigRepository } from "./coins.js";
import { randomNetworkHostFromConfig } from "./helpers.js";

import { BindingType } from "./service-provider.contract.js";
import { LinkService } from "./link.contract.js";
import { IContainer } from "./container.contracts.js";

export class AbstractLinkService implements LinkService {
	readonly #configRepository: ConfigRepository;

	public constructor(container: IContainer) {
		this.#configRepository = container.get(BindingType.ConfigRepository);
	}

	public block(id: string): string {
		return this.#buildURL(this.#configRepository.get("network.explorer.block"), id);
	}

	public transaction(id: string): string {
		return this.#buildURL(this.#configRepository.get("network.explorer.transaction"), id);
	}

	public wallet(id: string): string {
		return this.#buildURL(this.#configRepository.get("network.explorer.wallet"), id);
	}

	#buildURL(schema: string, id: string): string {
		const { host, query } = randomNetworkHostFromConfig(this.#configRepository, "explorer");

		const url: string = `${host.replace(/\/$/, "")}/${formatString(schema, id)}`;

		if (query) {
			return `${url}?${queryString.stringify(query)}`;
		}

		return url;
	}
}
