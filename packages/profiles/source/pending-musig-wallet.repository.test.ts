import { describe } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { bootContainer } from "../test/mocking";
import { ProfileSetting } from "./contracts";
import { Profile } from "./profile";
import { Wallet } from "./wallet";
import { WalletFactory } from "./wallet.factory.js";
import { PendingMusigWalletRepository } from "./pending-musig-wallet.repository";
import { IWalletData } from "./wallet.contract";

const generate = async (context: any, coin: string, network: string) => {
	const { wallet } = await context.factory.generate({ coin, network });

	context.subject.add(wallet);

	return wallet;
};

const importByMnemonic = async (context: any, mnemonic: string, coin: string, network: string, bip: number) => {
	const wallet = await context.factory[
		{
			39: "fromMnemonicWithBIP39",
			44: "fromMnemonicWithBIP44",
			49: "fromMnemonicWithBIP49",
			84: "fromMnemonicWithBIP84",
		}[bip]
	]({
		coin,
		levels: {
			39: {},
			44: { account: 0 },
			49: { account: 0 },
			84: { account: 0 },
		}[bip],
		mnemonic,
		network,
	});

	return wallet;
};

const createEnvironment = async (context, { loader, nock }) => {
	nock.fake("https://ark-test.payvo.com:443", { encodedQueryParams: true })
		.get("/api/node/configuration")
		.reply(200, loader.json("test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, loader.json("test/fixtures/client/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, loader.json("test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, loader.json("test/fixtures/client/syncing.json"))
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, loader.json("test/fixtures/client/wallet.json"))
		.get(/\/api\/wallets\/D.*/)
		.reply(404, `{"statusCode":404,"error":"Not Found","message":"Wallet not found"}`)
		.persist();

	const profile = new Profile({ avatar: "avatar", data: "", id: "profile-id", name: "name" });

	profile.settings().set(ProfileSetting.Name, "John Doe");

	context.subject = new PendingMusigWalletRepository(profile);
};

describe("PendingMusigWalletRepository", ({ beforeAll, beforeEach, loader, nock, assert, stub, it }) => {
	beforeAll(() => {
		bootContainer();
	});

	beforeEach(async (context) => {
		await createEnvironment(context, { loader, nock });
	});

	it("#add", async (context) => {
		await context.subject.add("D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW", "ARK", "ark.devnet");
		await context.subject.add("D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW", "ARK", "ark.devnet");

		const addresses = Object.values(context.subject.toObject()).map(
			(walletData: Record<string, any>) => walletData.data.ADDRESS,
		);
		assert.equal(addresses, ["D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW"]);
	});

	it("#add", async (context) => {
		await context.subject.fill({
			"05146383-b26d-4ac0-aad2-3d5cb7e6c5e2": {
				data: {
					COIN: "ARK",
					NETWORK: "ark.devnet",
					ADDRESS: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					PUBLIC_KEY: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
					BALANCE: [Object],
					BROADCASTED_TRANSACTIONS: {},
					DERIVATION_PATH: undefined,
					DERIVATION_TYPE: undefined,
					IMPORT_METHOD: "ADDRESS",
					SEQUENCE: "111932",
					SIGNED_TRANSACTIONS: {},
					PENDING_MULTISIGNATURE_TRANSACTIONS: {},
					VOTES: [],
					VOTES_AVAILABLE: 0,
					VOTES_USED: 0,
					ENCRYPTED_SIGNING_KEY: undefined,
					ENCRYPTED_CONFIRM_KEY: undefined,
					STARRED: false,
					LEDGER_MODEL: undefined,
					STATUS: "COLD",
				},
				id: "05146383-b26d-4ac0-aad2-3d5cb7e6c5e2",
				settings: {
					AVATAR: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="picasso" width="100" height="100" viewBox="0 0 100 100"><style>.picasso circle{mix-blend-mode:soft-light;}</style><rect fill="rgb(244, 67, 54)" width="100" height="100"/><circle r="45" cx="80" cy="40" fill="rgb(139, 195, 74)"/><circle r="40" cx="10" cy="30" fill="rgb(0, 188, 212)"/><circle r="60" cx="30" cy="50" fill="rgb(255, 193, 7)"/></svg>',
				},
			},
		});

		const addresses = Object.values(context.subject.toObject()).map(
			(walletData: Record<string, any>) => walletData.data.ADDRESS,
		);
		assert.equal(addresses, ["D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW"]);
	});
});
