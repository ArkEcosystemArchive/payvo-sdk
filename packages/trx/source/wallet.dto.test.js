import { assert, test } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

let subject;

test.before.each(async () => {
	subject = (await createService(WalletData)).fill(fixture.data[0]);
});

test("#address", () => {
	assert.is(subject.address(), fixture.data[0].address);
});

test("#publicKey", () => {
	assert.undefined(subject.publicKey());
});

test("#balance", () => {
	assert.equal(subject.balance().available, BigNumber.make("17491629"));
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
