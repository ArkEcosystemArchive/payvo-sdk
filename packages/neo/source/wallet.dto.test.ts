import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

describe("WalletData", async ({ beforeAll, it, assert }) => {
	beforeAll(async (context) => {
		context.subject = (await createService(WalletData)).fill(Fixture);
	});

	it("should have an address", (context) => {
		assert.is(context.subject.address(), "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF");
	});

	it("should have a balance", (context) => {
		assert.equal(context.subject.balance().available, BigNumber.make(3050000));
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
