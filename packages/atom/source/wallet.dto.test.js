import { assert, test } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

let subject;

test.before(async () => {
	subject = (await createService(WalletData)).fill({
		address: Fixture.result.value.address,
		publicKey: Fixture.result.value.public_key.value,
		balance: 22019458509,
		sequence: Fixture.result.value.sequence,
	});
});

test("#address", () => {
	assert.is(subject.address(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
});

test("#publicKey", () => {
	assert.is(subject.publicKey(), "Ap65s+Jdgo8BtvTbkc7GyUti8yJ7RpZ7cE1zCuKgNeXY");
});

test("#balance", () => {
	assert.equal(subject.balance().available, BigNumber.make(22019458509));
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
