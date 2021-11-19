import "reflect-metadata";

import { assert, test } from "@payvo/sdk-test";
import { ConfigKey, ConfigRepository } from "./config";
import { Container } from "./container";
import { BindingType } from "./service-provider.contract";
import { BigNumberService } from "./big-number.service";

for (const power of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
	test(`#make(${power})`, async () => {
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
			1,
		);
	});
}

test.run();
