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

	it("#address", ({ subject }) => {
		assert.is(subject.address(), "0x4581a610f96878266008993475f1476ca9997081");
	});

	it("#publicKey", ({ subject }) => {
		assert.undefined(subject.publicKey());
	});

	it("#balance", ({ subject }) => {
		assert.equal(subject.balance().available, BigNumber.make("10"));
	});

	it("#nonce", ({ subject }) => {
		assert.equal(subject.nonce(), BigNumber.ZERO);
	});

	it("#isMultiSignature", ({ subject }) => {
		assert.false(subject.isMultiSignature());
	});

	it("#isDelegate", ({ subject }) => {
		assert.false(subject.isDelegate());
	});

	it("#isSecondSignature", ({ subject }) => {
		assert.false(subject.isSecondSignature());
	});

	it("#isResignedDelegate", ({ subject }) => {
		assert.false(subject.isResignedDelegate());
	});
});
