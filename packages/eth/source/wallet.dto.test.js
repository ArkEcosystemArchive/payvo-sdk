import { assert, test } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

let subject;

test.before.each(
	async () =>
		(subject = (await createService(WalletData)).fill({
			address: "0x4581a610f96878266008993475f1476ca9997081",
			balance: 10,
			nonce: 0,
		})),
);

test("#address", () => {
	assert.is(subject.address(), "0x4581a610f96878266008993475f1476ca9997081");
});

test("#publicKey", () => {
	assert.undefined(subject.publicKey());
});

test("#balance", () => {
	assert.equal(subject.balance().available, BigNumber.make("10"));
});

test("#nonce", () => {
	assert.equal(subject.nonce(), BigNumber.ZERO);
});

test("#isMultiSignature", () => {
	assert.false(subject.isMultiSignature());
});

test("#isDelegate", () => {
	assert.false(subject.isDelegate());
});

test("#isSecondSignature", () => {
	assert.false(subject.isSecondSignature());
});

test("#isResignedDelegate", () => {
	assert.false(subject.isResignedDelegate());
});

test.run();
