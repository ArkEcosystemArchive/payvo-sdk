import { describe } from "@payvo/sdk-test";
import { Coins, IoC } from "@payvo/sdk";

import { createService } from "../test/mocking";
import { KnownWalletService } from "./known-wallet.service.js";

describe("KnownWalletService", async ({ assert, beforeAll, it, nock }) => {
	beforeAll(async (context) => {
		context.subject = await createService(KnownWalletService);
	});

	it("should return a list of known wallets if the request succeeds", async (context) => {
		const wallets = [
			{
				type: "team",
				name: "ACF Hot Wallet",
				address: "AagJoLEnpXYkxYdYkmdDSNMLjjBkLJ6T67",
			},
			{
				type: "team",
				name: "ACF Hot Wallet (old)",
				address: "AWkBFnqvCF4jhqPSdE2HBPJiwaf67tgfGR",
			},
		];

		nock.fake("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(200, wallets);

		assert.equal(await context.subject.all(), wallets);
	});

	it("should return an empty list if the request fails", async (context) => {
		nock.fake("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(404);

		assert.equal(await context.subject.all(), []);
	});

	it("should return an empty list if the request response is not an array", async (context) => {
		nock.fake("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(200, {});

		assert.equal(await context.subject.all(), []);
	});

	it("should return an empty list if the source is empty", async (context) => {
		context.subject = await createService(KnownWalletService, undefined, async (container) => {
			container.get(IoC.BindingType.ConfigRepository).forget(Coins.ConfigKey.KnownWallets);
		});

		assert.equal(await context.subject.all(), []);
	});
});
