import { assert, test } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

let subject;

test.before(async () => {
	subject = (await createService(WalletData)).fill(Fixture.data);
});

test("#address", () => {
	assert.is(subject.address(), "my48EN4kDnGEpRZMBfiDS65wdfwfgCGZRz");
});

test("#publicKey", () => {
	assert.is(subject.publicKey(), "76a914c05f53de525d80151e209a729cf1c7909c88f88e88ac");
});

test("#balance", () => {
	assert.equal(subject.balance().available, BigNumber.make(3000001));
});

test("#nonce", () => {
	assert.equal(subject.nonce(), BigNumber.make(0));
});

test("#secondPublicKey", () => {
	assert.undefined(subject.secondPublicKey());
});

test("#username", () => {
	assert.undefined(subject.username());
});

test("#rank", () => {
	assert.undefined(subject.rank());
});

test("#votes", () => {
	assert.undefined(subject.votes());
});

test("#multiSignature", () => {
	assert.is(() => subject.multiSignature()).toThrow(/does not have/);
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
