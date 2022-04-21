import { describe } from "@payvo/sdk-test";

import { filterHostsFromConfig, pluckAddress, randomNetworkHostFromConfig } from "./helpers.js";

describe("Helpers", ({ assert, it, nock, loader }) => {
	const configMock = {
		get: () => [
			{
				host: "https://wallets.ark.io",
				type: "full",
			},
			{
				host: "https://musig1.ark.io",
				type: "musig",
			},
			{
				host: "https://explorer.ark.io",
				type: "explorer",
			},
		],
	};

	it("should filter hosts by their their type", () => {
		assert.equal(filterHostsFromConfig(configMock, "explorer"), [
			{
				host: "https://explorer.ark.io",
				type: "explorer",
			},
		]);
	});

	it("should pick a random host", () => {
		assert.equal(randomNetworkHostFromConfig(configMock), {
			host: "https://wallets.ark.io",
			type: "full",
		});
	});

	it("should pick a random network host by type", () => {
		assert.equal(randomNetworkHostFromConfig(configMock, "explorer"), {
			host: "https://explorer.ark.io",
			type: "explorer",
		});
	});

	it("should pick a random network host", () => {
		assert.equal(randomNetworkHostFromConfig(configMock), {
			host: "https://wallets.ark.io",
			type: "full",
		});
	});

	it("should pluck an address by senderId", () => {
		assert.is(pluckAddress({ senderId: "senderId" }), "senderId");
	});

	it("should pluck an address by recipientId", () => {
		assert.is(pluckAddress({ recipientId: "recipientId" }), "recipientId");
	});

	it("should pluck an address by addresses", () => {
		assert.is(pluckAddress({ identifiers: [{ value: "addresses" }] }), "addresses");
	});

	it("should fail to pluck an address", () => {
		assert.throws(() => pluckAddress({ key: "value" }), "Failed to pluck any address.");
	});
});
