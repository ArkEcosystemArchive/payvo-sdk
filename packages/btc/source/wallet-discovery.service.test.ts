import { describe } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { WalletDiscoveryService } from "./wallet-discovery.service.js";
import { BindingType } from "./constants";
import { AddressFactory } from "./address.factory.js";

describe("testnet", ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(WalletDiscoveryService, "btc.testnet", (container) => {
			container.singleton(BindingType.AddressFactory, AddressFactory);
		});
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, [
			{
				address: "n2qGdjfjmFyvAXqbErrtXpfypXhtbNWruM",
				path: "m/44'/1'/0'/0/0",
				type: "bip44",
			},
			{
				address: "2N5Hnn7HAizAwizSUXsMtoGnBNuXdMxDzBt",
				path: "m/49'/1'/0'/0/0",
				type: "bip49",
			},
			{
				address: "tb1qdyxry6tza2sflfzlr8w6m65873thva724yjlmw",
				path: "m/84'/1'/0'/0/0",
				type: "bip84",
			},
		]);
	});

	it("should generate an output from a mnemonic for specific paths for each addressing schema", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic, {
			bip44: {
				account: 7,
				change: 0,
				addressIndex: 3,
			},
			bip49: {
				account: 8,
				change: 0,
				addressIndex: 2,
			},
			bip84: {
				account: 9,
				change: 0,
				addressIndex: 4,
			},
		});

		assert.equal(result, [
			{
				address: "mjS2VkYDn9ZxB4pVTgQGy5wYiPPwTnQHij",
				path: "m/44'/1'/7'/0/3",
				type: "bip44",
			},
			{
				address: "2NFZAMmZ86NKR5Jpe79dBXdMSGjGtCvwKzX",
				path: "m/49'/1'/8'/0/2",
				type: "bip49",
			},
			{
				address: "tb1qst6pxn2p9ltqqmuzn2j6yd4hnt07nkv36z42am",
				path: "m/84'/1'/9'/0/4",
				type: "bip84",
			},
		]);
	});

	it("should generate an output from a mnemonic for change chain", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic, {
			bip44: {
				account: 5,
				change: 1,
				addressIndex: 2,
			},
			bip49: {
				account: 5,
				change: 1,
				addressIndex: 2,
			},
			bip84: {
				account: 5,
				change: 1,
				addressIndex: 2,
			},
		});

		assert.equal(result, [
			{
				address: "mnaedh1YpvPsgybYyoyUjtnYaq91DjSXi4",
				path: "m/44'/1'/5'/1/2",
				type: "bip44",
			},
			{
				address: "2MuDFXtW2mF9rUPbwPF5y8Eu9nfyYGbVe88",
				path: "m/49'/1'/5'/1/2",
				type: "bip49",
			},
			{
				address: "tb1qw8fsvjcr63w06yl579ssgmugm0g9kkd0wjlxn3",
				path: "m/84'/1'/5'/1/2",
				type: "bip84",
			},
		]);
	});
});

describe("livenet", ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(WalletDiscoveryService, "btc.livenet", (container) => {
			container.singleton(BindingType.AddressFactory, AddressFactory);
		});
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, [
			{
				address: "1PLDRLacEkAaaiWnfojVDb5hWpwXvKJrRa",
				path: "m/44'/0'/0'/0/0",
				type: "bip44",
			},
			{
				address: "3GU5e9mPrLgPemhawVHHrDt6bjZZ6M9CPc",
				path: "m/49'/0'/0'/0/0",
				type: "bip49",
			},
			{
				address: "bc1qpeeu3vjrm9dn2y42sl926374y5cvdhfn5k7kxm",
				path: "m/84'/0'/0'/0/0",
				type: "bip84",
			},
		]);
	});

	it("should generate an output from a mnemonic for specific paths for each addressing schema", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic, {
			bip44: {
				account: 7,
				change: 0,
				addressIndex: 3,
			},
			bip49: {
				account: 8,
				change: 0,
				addressIndex: 2,
			},
			bip84: {
				account: 9,
				change: 0,
				addressIndex: 4,
			},
		});

		assert.equal(result, [
			{
				address: "1DFirytnzyKwMBA2T8JNhjzwEoEimKTCKd",
				path: "m/44'/0'/7'/0/3",
				type: "bip44",
			},
			{
				address: "38LF6P6FtA8vBgU4t1CmREHa2cCEiNQ8qt",
				path: "m/49'/0'/8'/0/2",
				type: "bip49",
			},
			{
				address: "bc1q54m8puq4lwfmtcyv44x9ls2mztn6sgvde50vmh",
				path: "m/84'/0'/9'/0/4",
				type: "bip84",
			},
		]);
	});

	it("should generate an output from a mnemonic for change chain", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic, {
			bip44: {
				account: 5,
				change: 1,
				addressIndex: 2,
			},
			bip49: {
				account: 5,
				change: 1,
				addressIndex: 2,
			},
			bip84: {
				account: 5,
				change: 1,
				addressIndex: 2,
			},
		});

		assert.equal(result, [
			{
				address: "1PSddm78a9UnGWvL5xVCAcV7HddY16Vgjv",
				path: "m/44'/0'/5'/1/2",
				type: "bip44",
			},
			{
				address: "3CkZ9ZButJgfwEY3cdKWmoxAGXFMUcSRjB",
				path: "m/49'/0'/5'/1/2",
				type: "bip49",
			},
			{
				address: "bc1qw46dyhspu2tr7vsclyr7g9l99wwp3hyk5w8qqn",
				path: "m/84'/0'/5'/1/2",
				type: "bip84",
			},
		]);
	});
});
