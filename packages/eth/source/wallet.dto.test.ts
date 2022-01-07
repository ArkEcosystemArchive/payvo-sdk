import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { WalletData } from "./wallet.dto.js";
import { createService } from "../test/mocking";

describe("WalletData", async ({ beforeEach, it, assert }) => {
	beforeEach(
		async (context) =>
			(context.subject = (await createService(WalletData)).fill({
				address: "0x4581a610f96878266008993475f1476ca9997081",
				balance: 10,
				nonce: 0,
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
