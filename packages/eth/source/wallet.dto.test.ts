import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

describe("WalletData", async ({ beforeEach, it, assert }) => {
	beforeEach(
		async (context) =>
			(context.subject = (await createService(WalletData)).fill({
				address: "0x4581a610f96878266008993475f1476ca9997081",
				balance: 10,
				nonce: 0,
				tokens: {
					"0xB8c77482e45F1F44dE1745F52C74426C631bDD52": 10,
					"0x2b591e99afe9f32eaa6214f7b7629768c40eeb39": 25.5,
				},
			})),
	);

	it("should have an address", (context) => {
		assert.is(context.subject.address(), "0x4581a610f96878266008993475f1476ca9997081");
	});

	it("should have a publicKey", (context) => {
		assert.undefined(context.subject.publicKey());
	});

	it("should have a balance", (context) => {
		assert.equal(context.subject.balance().available, BigNumber.make("10"));
	});

	it("should have a list of tokens and its balances", (context) => {
		const balance = context.subject.balance();

		assert.length(Object.keys(balance.tokens), 2);
		assert.equal(balance.tokens["0xB8c77482e45F1F44dE1745F52C74426C631bDD52"], BigNumber.make("10"));
		assert.equal(balance.tokens["0x2b591e99afe9f32eaa6214f7b7629768c40eeb39"], BigNumber.make("25.5"));
	});

	it("should have a nonce", (context) => {
		assert.equal(context.subject.nonce(), BigNumber.ZERO);
	});

	it("should have a method to know if wallet is multisignature", (context) => {
		assert.false(context.subject.isMultiSignature());
	});

	it("should have a method to know if wallet is delegate", (context) => {
		assert.false(context.subject.isDelegate());
	});

	it("should have a method to know if wallet is second signature", (context) => {
		assert.false(context.subject.isSecondSignature());
	});

	it("should have a method to know if wallet is a resigned delegate", (context) => {
		assert.false(context.subject.isResignedDelegate());
	});
});
