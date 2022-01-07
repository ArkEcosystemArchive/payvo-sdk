import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService } from "../test/mocking";

describe("WalletData", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = (await createService(WalletData)).fill(fixture.data[0]);
	});

	it("should have an address", (context) => {
		assert.is(context.subject.address(), fixture.data[0].address);
	});

	it("should have a method to know if wallet pu blickey", (context) => {
		assert.undefined(context.subject.publicKey());
	});

	it("should have a balance", (context) => {
		assert.equal(context.subject.balance(context).available, BigNumber.make("17491629"));
	});

	it("should have a nonce", (context) => {
		assert.equal(context.subject.nonce(), BigNumber.make(24242));
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
