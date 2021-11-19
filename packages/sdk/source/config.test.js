import { assert, test } from "@payvo/sdk-test";
import { ConfigRepository } from "./config";

let subject;

test.before.each(async () => {
	subject = new ConfigRepository({
		network: "ark.mainnet",
	});
});

test("#constructor", () => {
	assert.throws(
		() =>
			new ConfigRepository({
				network: 123,
			}),
		'Failed to validate the configuration: "network" must be a string',
	);
});

test("#all", () => {
	assert.equal(subject.all(), {
		network: "ark.mainnet",
	});
});

test("#get | #set", () => {
	assert.is(subject.get("network"), "ark.mainnet");

	subject.set("network", "ark.devnet");

	assert.is(subject.get("network"), "ark.devnet");

	assert.throws(() => subject.get("key"), "The [key] is an unknown configuration value.");
});

test("#getLoose", () => {
	assert.not.throws(() => subject.getLoose("hello.world"), "The [key] is an unknown configuration value.");
});

test("#has", () => {
	assert.false(subject.has("key"));

	subject.set("key", "value");

	assert.true(subject.has("key"));
});

test("#missing", () => {
	assert.true(subject.missing("key"));

	subject.set("key", "value");

	assert.false(subject.missing("key"));
});

test("#forget", () => {
	assert.true(subject.missing("key"));

	subject.set("key", "value");

	assert.false(subject.missing("key"));

	subject.forget("key");

	assert.true(subject.missing("key"));
});

test("ConfigKey", () => {
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
