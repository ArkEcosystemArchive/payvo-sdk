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
	assert.is(subject.address(), "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF");
});

test("#publicKey", () => {
	assert.throws(() => subject.publicKey(), "not implemented");
});

test("#balance", () => {
	assert.equal(subject.balance().available, BigNumber.make(3050000));
});

test("#nonce", () => {
	assert.equal(subject.nonce(), BigNumber.make(24242));
});

test("#secondPublicKey", () => {
	assert.throws(() => subject.secondPublicKey(), "not implemented");
});

test("#username", () => {
	assert.throws(() => subject.username(), "not implemented");
});

test("#rank", () => {
	assert.throws(() => subject.rank(), "not implemented");
});

test("#votes", () => {
	assert.throws(() => subject.votes(), "not implemented");
});

test("#multiSignature", () => {
	assert.throws(() => subject.multiSignature(), "not implemented");
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
