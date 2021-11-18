/* istanbul ignore file */
/* eslint-disable import/order */

import { formatString } from "@payvo/sdk-helpers";
import { URL } from "url";

import { ConfigRepository } from "./coins.js";
import { randomNetworkHostFromConfig } from "./helpers.js";
import { inject, injectable } from "./ioc.js";
import { BindingType } from "./service-provider.contract.js";
import { LinkService } from "./link.contract.js";

@injectable()
export class AbstractLinkService implements LinkService {
	@inject(BindingType.ConfigRepository)
	private readonly configRepository!: ConfigRepository;

	public block(id: string): string {
		return this.#buildURL(this.configRepository.get("network.explorer.block"), id);
	}

	public transaction(id: string): string {
		return this.#buildURL(this.configRepository.get("network.explorer.transaction"), id);
	}

	public wallet(id: string): string {
		return this.#buildURL(this.configRepository.get("network.explorer.wallet"), id);
	}

	#buildURL(schema: string, id: string): string {
		const { host, query } = randomNetworkHostFromConfig(this.configRepository, "explorer");
		const url: URL = new URL(formatString(schema, id), host);

		if (query) {
			url.search = new URLSearchParams(query).toString();
		}

		return url.toString();
	}
}
