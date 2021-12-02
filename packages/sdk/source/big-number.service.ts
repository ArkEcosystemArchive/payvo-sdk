import "reflect-metadata";

import { BigNumber, NumberLike } from "@payvo/sdk-helpers";

import { ConfigKey, ConfigRepository } from "./config.js";
import { inject, injectable } from "./ioc.js";
import { BindingType } from "./service-provider.contract.js";

@injectable()
export class BigNumberService {
    @inject(BindingType.ConfigRepository)
    private readonly configRepository!: ConfigRepository;

    public make(value: NumberLike): BigNumber {
        return BigNumber.make(value, this.configRepository.get<number>(ConfigKey.CurrencyDecimals));
    }
}
