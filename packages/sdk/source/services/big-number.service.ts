import "reflect-metadata";

import { BigNumber, NumberLike } from "@payvo/sdk-helpers";

import { ConfigKey, ConfigRepository } from "../coins/config.js";
import { inject, injectable } from "../ioc/index.js";
import { BindingType } from "../ioc/service-provider.contract";

@injectable()
export class BigNumberService {
    @inject(BindingType.ConfigRepository)
    private readonly configRepository!: ConfigRepository;

    public make(value: NumberLike): BigNumber {
        return BigNumber.make(value, this.configRepository.get<number>(ConfigKey.CurrencyDecimals));
    }
}
