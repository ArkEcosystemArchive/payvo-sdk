import { assert, test } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

let subject;

test.before(async () => {
	subject = (await createService(WalletData)).fill(Fixture);
});

test("#address", () => {
	assert.is(subject.address(), "bdfkbzietxos");
});

test("#publicKey", () => {
	assert.undefined(subject.publicKey());
});

test("#balance", () => {
	assert.equal(subject.balance().available, BigNumber.make(3050000));
});

test("#nonce", () => {
	assert.equal(subject.nonce(), BigNumber.make(24242));
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
