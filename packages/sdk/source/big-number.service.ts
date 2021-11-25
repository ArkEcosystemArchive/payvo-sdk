import { BigNumber, NumberLike } from "@payvo/sdk-helpers";

import { ConfigKey, ConfigRepository } from "./config.js";
import { Container } from "./container.js";
import { BindingType } from "./service-provider.contract.js";

// @TODO
// how could we clean this up to not require decorators
// or constructor assignments but still be type-safe
export class BigNumberService {
	readonly #configRepository: ConfigRepository;

	public constructor(container: Container) {
		this.#configRepository = container.get(BindingType.ConfigRepository);
	}

	public make(value: NumberLike): BigNumber {
		return BigNumber.make(value, this.#configRepository.get<number>(ConfigKey.CurrencyDecimals));
	}
}
