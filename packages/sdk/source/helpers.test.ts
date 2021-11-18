import { ConfigRepository } from "./coins/index.js";
import { filterHostsFromConfig, pluckAddress, randomNetworkHostFromConfig, randomHostFromConfig } from "./helpers.js";

test.after.each(() => jest.restoreAllMocks());

const configMock = {
	get: () => [
		{
			type: "full",
			host: "https://wallets.ark.io",
		},
		{
			type: "musig",
			host: "https://musig1.ark.io",
		},
		{
			type: "explorer",
			host: "https://explorer.ark.io",
		},
	],
} as unknown as ConfigRepository;

test("filterHostsFromConfig", () => {
	assert.is(filterHostsFromConfig(configMock, "explorer"), [
		{
			type: "explorer",
			host: "https://explorer.ark.io",
		},
	]);
});

test("randomNetworkHostFromConfig", () => {
	assert.is(randomNetworkHostFromConfig(configMock, "explorer"), {
		type: "explorer",
		host: "https://explorer.ark.io",
	});
});

test("randomNetworkHostFromConfig default", () => {
	assert.is(randomNetworkHostFromConfig(configMock), {
		type: "full",
		host: "https://wallets.ark.io",
	});
});

test("randomHostFromConfig default", () => {
	assert.is(randomHostFromConfig(configMock), "https://wallets.ark.io");
});

describe("pluckAddress", () => {
	test("senderId", () => {
		assert.is(pluckAddress({ senderId: "senderId" }), "senderId");
	});

	test("recipientId", () => {
		assert.is(pluckAddress({ recipientId: "recipientId" }), "recipientId");
	});

	test("addresses", () => {
		assert.is(pluckAddress({ identifiers: [{ value: "addresses" }] }), "addresses");
	});

	test("addresses", () => {
		assert.is(() => pluckAddress({ key: "value" })).toThrow("Failed to pluck any address.");
	});
});
