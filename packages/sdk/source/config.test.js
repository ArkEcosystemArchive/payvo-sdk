import { describe } from "@payvo/sdk-test";
import { ConfigKey, ConfigRepository } from "./config";

let subject;

describe("ConfigRepository", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = new ConfigRepository({
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

	it("get all values", () => {
		assert.equal(subject.all(), {
			network: "ark.mainnet",
		});
	});

	it("should set and get a value", () => {
		assert.is(subject.get("network"), "ark.mainnet");

		subject.set("network", "ark.devnet");

		assert.is(subject.get("network"), "ark.devnet");

		assert.throws(() => subject.get("key"), "The [key] is an unknown configuration value.");
	});

	it("shoul get a value without throwing if it does not exist", () => {
		assert.not.throws(() => subject.getLoose("hello.world"), "The [key] is an unknown configuration value.");
	});

	it("should determine if a value exists", () => {
		assert.false(subject.has("key"));

		subject.set("key", "value");

		assert.true(subject.has("key"));
	});

	it("should determine if a value is missing", () => {
		assert.true(subject.missing("key"));

		subject.set("key", "value");

		assert.false(subject.missing("key"));
	});

	it("should forget a value", () => {
		assert.true(subject.missing("key"));

		subject.set("key", "value");

		assert.false(subject.missing("key"));

		subject.forget("key");

		assert.true(subject.missing("key"));
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
