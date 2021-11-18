import { Coins, IoC } from "@payvo/sdk";
import nock from "nock";

import { createService, requireModule } from "../test/mocking.js";
import { KnownWalletService } from "./known-wallet.service.js";

let subject: KnownWalletService;

beforeAll(() => nock.disableNetConnect());

test.before.each(async () => {
	subject = await createService(KnownWalletService);
});

test.after.each(() => nock.cleanAll());

describe("KnownWalletService", () => {
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

		nock("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(200, wallets);

		await assert.is(subject.all()).resolves.toEqual(wallets);
	});

	it("should return an empty list if the request fails", async () => {
		nock("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(404);

		await assert.is(subject.all()).resolves.toEqual([]);
	});

	it("should return an empty list if the request response is not an array", async () => {
		nock("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(200, {});

		await assert.is(subject.all()).resolves.toEqual([]);
	});

	it("should return an empty list if the source is empty", async () => {
		subject = await createService(KnownWalletService, undefined, async (container: IoC.Container) => {
			container
				.get<Coins.ConfigRepository>(IoC.BindingType.ConfigRepository)
				.forget(Coins.ConfigKey.KnownWallets);
		});

		await assert.is(subject.all()).resolves.toEqual([]);
	});
});
