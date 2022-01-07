import { describe } from "@payvo/sdk-test";

import { ConfigKey, ConfigRepository } from "./config.js";

describe("ConfigRepository", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = new ConfigRepository({
			network: "ark.mainnet",
		});
	});

	it("should fail to create a new instance", () => {
		assert.throws(
			() =>
				new ConfigRepository({
					network: 123,
				}),
			'Failed to validate the configuration: "network" must be a string',
		);
	});

	it("get all values", (context) => {
		assert.equal(context.subject.all(), {
			network: "ark.mainnet",
		});
	});

	it("should set and get a value", (context) => {
		assert.is(context.subject.get("network"), "ark.mainnet");

		context.subject.set("network", "ark.devnet");

		assert.is(context.subject.get("network"), "ark.devnet");

		assert.throws(() => context.subject.get("key"), "The [key] is an unknown configuration value.");
	});

	it("shoul get a value without throwing if it does not exist", (context) => {
		assert.not.throws(
			() => context.subject.getLoose("hello.world"),
			"The [key] is an unknown configuration value.",
		);
	});

	it("should determine if a value exists", (context) => {
		assert.false(context.subject.has("key"));

		context.subject.set("key", "value");

		assert.true(context.subject.has("key"));
	});

	it("should determine if a value is missing", (context) => {
		assert.true(context.subject.missing("key"));

		context.subject.set("key", "value");

		assert.false(context.subject.missing("key"));
	});

	it("should forget a value", (context) => {
		assert.true(context.subject.missing("key"));

		context.subject.set("key", "value");

		assert.false(context.subject.missing("key"));

		context.subject.forget("key");

		assert.true(context.subject.missing("key"));
	});

	it("should have a list of configuration keys", () => {
		assert.equal(ConfigKey, {
			Bech32: "network.constants.bech32",
			CurrencyDecimals: "network.currency.decimals",
			CurrencyTicker: "network.currency.ticker",
			HttpClient: "httpClient",
			KnownWallets: "network.knownWallets",
			Network: "network",
			NetworkId: "network.id",
			NetworkType: "network.type",
			Slip44: "network.constants.slip44",
		});
	});
});
