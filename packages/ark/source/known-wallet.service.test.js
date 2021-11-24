import { describe } from "@payvo/sdk-test";
import { Coins, IoC } from "@payvo/sdk";
import { nock } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { KnownWalletService } from "./known-wallet.service";

let subject;

describe("KnownWalletService", async ({ assert, afterEach, beforeAll, beforeEach, it }) => {
	beforeAll(() => nock.disableNetConnect());

	beforeEach(async () => {
		subject = await createService(KnownWalletService);
	});

	it("should return a list of known wallets if the request succeeds", async () => {
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

		assert.equal(await subject.all(), wallets);
	});

	it("should return an empty list if the request fails", async () => {
		nock.fake("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(404);

		assert.equal(await subject.all(), []);
	});

	it("should return an empty list if the request response is not an array", async () => {
		nock.fake("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(200, {});

		assert.equal(await subject.all(), []);
	});

	it("should return an empty list if the source is empty", async () => {
		subject = await createService(KnownWalletService, undefined, async (container) => {
			container.get(IoC.BindingType.ConfigRepository).forget(Coins.ConfigKey.KnownWallets);
		});

		assert.equal(await subject.all(), []);
	});
});
