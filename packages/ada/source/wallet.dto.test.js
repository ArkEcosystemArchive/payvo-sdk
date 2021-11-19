import { assert, describe, loader, test } from "@payvo/sdk-test";
import Fixture from "../test/fixtures/client/wallet.json";
import { createService } from "../test/mocking";
import { WalletData } from "./wallet.dto";

let subject;

test.before(async () => {
	subject = (await createService(WalletData)).fill(Fixture);
});

test("#address", () => {
	assert.is(subject.address(), "98c83431e94407bc0889e09953461fe5cecfdf18");
});

test("#balance", () => {
	assert.is(subject.balance().available.toString(), "2000000000");
	assert.is(subject.balance().fees.toString(), "0");
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
