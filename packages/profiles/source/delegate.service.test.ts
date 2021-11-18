import "reflect-metadata";

import nock from "nock";
import { UUID } from "@payvo/sdk-cryptography";

import { bootContainer } from "../test/mocking.js";
import { identity } from "../test/fixtures/identity.js";
import { Profile } from "./profile.js";
import { Wallet } from "./wallet.js";
import { DelegateService } from "./delegate.service.js";
import { IReadWriteWallet } from "./contracts.js";

let subject: DelegateService;

beforeAll(() => {
	bootContainer();

	nock.disableNetConnect();
});

let wallet: IReadWriteWallet;
let profile: Profile;

test.before.each(async () => {
	nock(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../test/fixtures/client/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/delegates")
		.reply(200, require("../test/fixtures/client/delegates-1.json"))
		.get("/api/delegates?page=2")
		.reply(200, require("../test/fixtures/client/delegates-2.json"))
		.persist();

	profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });
	subject = new DelegateService();

	wallet = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: identity.mnemonic,
	});
});

describe("DelegateService", () => {
	it("should sync the delegates", async () => {
		assert.is(() => subject.all("ARK", "ark.devnet")).toThrowError("have not been synchronized yet");

		await subject.sync(profile, "ARK", "ark.devnet");

		assert.is(subject.all("ARK", "ark.devnet")).toBeArray();
		assert.is(subject.all("ARK", "ark.devnet")).toHaveLength(200);
	});

	it("should sync the delegates only one page", async () => {
		nock.cleanAll();
		nock(/.+/).get("/api/delegates").reply(200, require("../test/fixtures/client/delegates-single-page.json"));

		assert.is(() => subject.all("ARK", "ark.devnet")).toThrowError("have not been synchronized yet");

		await subject.sync(profile, "ARK", "ark.devnet");

		assert.is(subject.all("ARK", "ark.devnet")).toBeArray();
		assert.is(subject.all("ARK", "ark.devnet")).toHaveLength(10);
	});

	it("should sync the delegates when network does not support FastDelegateSync", async () => {
		assert.is(() => subject.all("ARK", "ark.devnet")).toThrowError("have not been synchronized yet");

		jest.spyOn(profile.coins().set("ARK", "ark.devnet").network(), "meta").mockReturnValue({
			fastDelegateSync: false,
		});

		await subject.sync(profile, "ARK", "ark.devnet");

		assert.is(subject.all("ARK", "ark.devnet")).toBeArray();
		assert.is(subject.all("ARK", "ark.devnet")).toHaveLength(200);
	});

	it("should sync the delegates of all coins", async () => {
		assert.is(() => subject.all("ARK", "ark.devnet")).toThrowError("have not been synchronized yet");

		await subject.syncAll(profile);

		assert.is(subject.all("ARK", "ark.devnet")).toBeArray();
		assert.is(subject.all("ARK", "ark.devnet")).toHaveLength(200);
	});

	it("#findByAddress", async () => {
		await subject.syncAll(profile);
		assert.is(subject.findByAddress("ARK", "ark.devnet", "DSyG9hK9CE8eyfddUoEvsga4kNVQLdw2ve")).toBeTruthy();
		assert.is(() => subject.findByAddress("ARK", "ark.devnet", "unknown")).toThrowError(/No delegate for/);
	});

	it("#findByPublicKey", async () => {
		await subject.syncAll(profile);
		assert
			.is(
				subject.findByPublicKey(
					"ARK",
					"ark.devnet",
					"033a5474f68f92f254691e93c06a2f22efaf7d66b543a53efcece021819653a200",
				),
			)
			.toBeTruthy();
		assert.is(() => subject.findByPublicKey("ARK", "ark.devnet", "unknown")).toThrowError(/No delegate for/);
	});

	it("#findByUsername", async () => {
		await subject.syncAll(profile);
		assert.is(subject.findByUsername("ARK", "ark.devnet", "alessio")).toBeTruthy();
		assert.is(() => subject.findByUsername("ARK", "ark.devnet", "unknown")).toThrowError(/No delegate for/);
	});

	describe("#map", () => {
		it("should return an empty array if there are no public keys", async () => {
			const mappedDelegates = subject.map(wallet, []);

			assert.is(mappedDelegates).toBeArray();
			assert.is(mappedDelegates).toHaveLength(0);
		});

		it("should map the public keys to read-only wallets", async () => {
			const delegates = require("../test/fixtures/client/delegates-1.json").data;
			const addresses = delegates.map((delegate) => delegate.address);
			const publicKeys = delegates.map((delegate) => delegate.publicKey);
			const usernames = delegates.map((delegate) => delegate.username);

			await subject.sync(profile, wallet.coinId(), wallet.networkId());

			const mappedDelegates = subject.map(wallet, publicKeys);

			assert.is(mappedDelegates).toBeArray();
			assert.is(mappedDelegates).toHaveLength(100);

			for (let i = 0; i < delegates.length; i++) {
				assert.is(mappedDelegates[i].address(), addresses[i]);
				assert.is(mappedDelegates[i].publicKey(), publicKeys[i]);
				assert.is(mappedDelegates[i].username(), usernames[i]);
			}
		});

		it("should skip public keys for which it does not find a delegate", async () => {
			const delegates = require("../test/fixtures/client/delegates-1.json").data;
			const addresses = delegates.map((delegate) => delegate.address);
			const publicKeys = delegates.map((delegate) => delegate.publicKey);
			const usernames = delegates.map((delegate) => delegate.username);

			await subject.sync(profile, wallet.coinId(), wallet.networkId());

			const mappedDelegates = subject.map(wallet, publicKeys.concat(["pubkey"]));

			assert.is(mappedDelegates).toBeArray();
			assert.is(mappedDelegates).toHaveLength(100);

			for (let i = 0; i < delegates.length; i++) {
				assert.is(mappedDelegates[i].address(), addresses[i]);
				assert.is(mappedDelegates[i].publicKey(), publicKeys[i]);
				assert.is(mappedDelegates[i].username(), usernames[i]);
			}
		});
	});
});
