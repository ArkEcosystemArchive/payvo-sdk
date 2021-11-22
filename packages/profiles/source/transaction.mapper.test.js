import { assert, describe, stub, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { Collections } from "@payvo/sdk";
import nock from "nock";
import { UUID } from "@payvo/sdk-cryptography";

import { identity } from "../test/fixtures/identity";
import { bootContainer } from "../test/mocking";
import { IProfile, IReadWriteWallet, ProfileSetting } from "./contracts";
import { Profile } from "./profile";
import { Wallet } from "./wallet";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";
import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection";
import { transformTransactionData, transformConfirmedTransactionDataCollection } from "./transaction.mapper";

const data = [
	[ExtendedConfirmedTransactionData, "isDelegateRegistration"],
	[ExtendedConfirmedTransactionData, "isDelegateResignation"],
	[ExtendedConfirmedTransactionData, "isHtlcClaim"],
	[ExtendedConfirmedTransactionData, "isHtlcLock"],
	[ExtendedConfirmedTransactionData, "isHtlcRefund"],
	[ExtendedConfirmedTransactionData, "isIpfs"],
	[ExtendedConfirmedTransactionData, "isMultiPayment"],
	[ExtendedConfirmedTransactionData, "isMultiSignatureRegistration"],
	[ExtendedConfirmedTransactionData, "isSecondSignature"],
	[ExtendedConfirmedTransactionData, "isTransfer"],
	[ExtendedConfirmedTransactionData, "isVote"],
	[ExtendedConfirmedTransactionData, "isUnvote"],
	[ExtendedConfirmedTransactionData, "isOther"],
];

test.before(() => bootContainer());

describe("transaction-mapper", ({ afterEach, beforeEach, test }) => {
	let profile;
	let wallet;

	const dummyTransactionData = {
		isMagistrate: () => false,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isHtlcClaim: () => false,
		isHtlcLock: () => false,
		isHtlcRefund: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isMultiSignatureRegistration: () => false,
		isSecondSignature: () => false,
		isTransfer: () => false,
		isVote: () => false,
		isUnvote: () => false,
	};

	test.before(async () => {
		nock.disableNetConnect();

		nock(/.+/)
			.get("/api/peers")
			.reply(200, require("../test/fixtures/client/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../test/fixtures/client/syncing.json"))
			.persist();

		profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });

		profile.settings().set(ProfileSetting.Name, "John Doe");

		wallet = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: "ARK",
			network: "ark.devnet",
			mnemonic: identity.mnemonic,
		});
	});

	// it.each(data)(`should map %p correctly`, (className, functionName) => {
	// 	assert.instance(
	// 		transformTransactionData(wallet, {
	// 			...dummyTransactionData,
	// 			[String(functionName)]: () => true,
	// 		}),
	// 		className,
	// 	);
	// });

	test("should map collection correctly", () => {
		const pagination = {
			prev: "before",
			self: "now",
			next: "after",
			last: "last",
		};

		// @ts-ignore
		const transactionData = new ExtendedConfirmedTransactionData(wallet, {
			isMagistrate: () => true,
		});

		// @ts-ignore
		const collection = new Collections.ConfirmedTransactionDataCollection([transactionData], pagination);

		const transformedCollection = transformConfirmedTransactionDataCollection(wallet, collection);
		assert.instance(transformedCollection, ExtendedConfirmedTransactionDataCollection);
		assert.is(transformedCollection.getPagination(), pagination);
	});
});

test.run();
