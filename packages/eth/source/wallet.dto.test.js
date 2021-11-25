import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

describe('WalletData', async ({ beforeEach, it, assert }) => {
	beforeEach(
		async (context) =>
			(context.subject = (await createService(WalletData)).fill({
				address: "0x4581a610f96878266008993475f1476ca9997081",
				balance: 10,
				nonce: 0,
			})),
	);

	it("should have an address", ({ subject }) => {
		assert.is(subject.address(), "0x4581a610f96878266008993475f1476ca9997081");
	});

	it("should have a publicKey", ({ subject }) => {
		assert.undefined(subject.publicKey());
	});

	it("should have a balance", ({ subject }) => {
		assert.equal(subject.balance().available, BigNumber.make("10"));
	});

	it("should have a nonce", ({ subject }) => {
		assert.equal(subject.nonce(), BigNumber.ZERO);
	});

	it("should have a method to know if wallet is multisignature", ({ subject }) => {
		assert.false(subject.isMultiSignature());
	});

	it("should have a method to know if wallet is delegate", ({ subject }) => {
		assert.false(subject.isDelegate());
	});

	it("should have a method to know if wallet is second signature", ({ subject }) => {
		assert.false(subject.isSecondSignature());
	});

	it("should have a method to know if wallet is a resigned delegate", ({ subject }) => {
		assert.false(subject.isResignedDelegate());
	});
});
