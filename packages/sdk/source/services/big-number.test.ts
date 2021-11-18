import "reflect-metadata";

import { ConfigKey, ConfigRepository } from "../coins/config.js";
import { Container } from "../ioc/index.js";
import { BindingType } from "../ioc/service-provider.contract.js";
import { BigNumberService } from "./big-number.service.js";

test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])("#make(%s)", async (power) => {
    const container = new Container();

    const configRepository = new ConfigRepository({});
    configRepository.set(ConfigKey.Network, {
        currency: {
            decimals: power,
        },
    });

    container.constant(BindingType.ConfigRepository, configRepository);

    assert.is(
        container
            .resolve(BigNumberService)
            .make(`1${"0".repeat(power)}`)
            .toHuman(),
	, 1);
});
