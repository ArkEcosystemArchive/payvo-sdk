import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService } from "../test/mocking";

describe("WalletData", async ({ it, assert, beforeAll }) => {
	beforeAll(async (context) => (context.subject = (await createService(WalletData)).fill(Fixture.data)));

	it("should have an address", (context) => {
		assert.is(context.subject.address(), "my48EN4kDnGEpRZMBfiDS65wdfwfgCGZRz");
	});

	it("should have a public key", (context) => {
		assert.is(context.subject.publicKey(), "76a914c05f53de525d80151e209a729cf1c7909c88f88e88ac");
	});

	it("should have a balance", (context) => {
		assert.equal(context.subject.balance().available, BigNumber.make(3000001));
	});

	it("should have a nonce", (context) => {
		assert.equal(context.subject.nonce(), BigNumber.make(0));
	});

	it("should have a second public key", (context) => {
		assert.undefined(context.subject.secondPublicKey());
	});

	it("should have a username", (context) => {
		assert.undefined(context.subject.username());
	});

	it("should have a rank", (context) => {
		assert.undefined(context.subject.rank());
	});

	it("should have votes", (context) => {
		assert.undefined(context.subject.votes());
	});

	it("should have a method to get multisignature data", (context) => {
		assert.throws(() => context.subject.multiSignature(), "does not have");
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
