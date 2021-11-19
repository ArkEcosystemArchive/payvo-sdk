import { assert, test } from "@payvo/sdk-test";
import { filterHostsFromConfig, pluckAddress, randomNetworkHostFromConfig, randomHostFromConfig } from "./helpers";

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
};

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
		assert.throws(() => pluckAddress({ key: "value" }), "Failed to pluck any address.");
	});
});

test.run();
