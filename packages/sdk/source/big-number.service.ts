import { BigNumber, NumberLike } from "@payvo/sdk-helpers";

import { ConfigKey, ConfigRepository } from "./config.js";
import { IContainer } from "./container.contracts.js";

import { BindingType } from "./service-provider.contract.js";

export class BigNumberService {
	readonly #configRepository: ConfigRepository;

	public constructor(container: IContainer) {
		this.#configRepository = container.get(BindingType.ConfigRepository);
	}

	public make(value: NumberLike): BigNumber {
		return BigNumber.make(value, this.#configRepository.get<number>(ConfigKey.CurrencyDecimals));
	}
}
