import { ConfigKey, ConfigRepository } from "./config";

let subject: ConfigRepository;

test.before.each(async () => {
	subject = new ConfigRepository({
		network: "ark.mainnet",
	});
});

test("#constructor", () => {
	assert
		.is(
			() =>
				new ConfigRepository({
					network: 123,
				}),
		)
		.toThrow('Failed to validate the configuration: "network" must be a string');
});

test("#all", () => {
	assert.is(subject.all()).toMatchInlineSnapshot(`
		Object {
		  "network": "ark.mainnet",
		}
	`);
});

test("#get | #set", () => {
	assert.is(subject.get("network"), "ark.mainnet");

	subject.set("network", "ark.devnet");

	assert.is(subject.get("network"), "ark.devnet");

	assert.is(() => subject.get("key")).toThrow("The [key] is an unknown configuration value.");
});

test("#getLoose", () => {
	assert.is(() => subject.getLoose("hello.world")).not.toThrow("The [key] is an unknown configuration value.");
});

test("#has", () => {
	assert.is(subject.has("key"), false);

	subject.set("key", "value");

	assert.is(subject.has("key"), true);
});

test("#missing", () => {
	assert.is(subject.missing("key"), true);

	subject.set("key", "value");

	assert.is(subject.missing("key"), false);
});

test("#forget", () => {
	assert.is(subject.missing("key"), true);

	subject.set("key", "value");

	assert.is(subject.missing("key"), false);

	subject.forget("key");

	assert.is(subject.missing("key"), true);
});

test("ConfigKey", () => {
	assert.is(ConfigKey).toMatchInlineSnapshot(`
		Object {
		  "Bech32": "network.constants.bech32",
		  "CurrencyDecimals": "network.currency.decimals",
		  "CurrencyTicker": "network.currency.ticker",
		  "HttpClient": "httpClient",
		  "KnownWallets": "network.knownWallets",
		  "Network": "network",
		  "NetworkId": "network.id",
		  "NetworkType": "network.type",
		  "Slip44": "network.constants.slip44",
		}
	`);
});
