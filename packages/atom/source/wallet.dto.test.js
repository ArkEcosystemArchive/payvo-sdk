import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

let subject;

describe("WalletData", async ({ beforeAll, assert, it }) => {
	beforeAll(async () => {
		subject = (await createService(WalletData)).fill({
			address: Fixture.result.value.address,
			publicKey: Fixture.result.value.public_key.value,
			balance: 22019458509,
			sequence: Fixture.result.value.sequence,
		});
	});

	it("should have an address", () => {
		assert.is(subject.address(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
	});

	it("should have a publicKey", () => {
		assert.is(subject.publicKey(), "Ap65s+Jdgo8BtvTbkc7GyUti8yJ7RpZ7cE1zCuKgNeXY");
	});

	it("should have balance", () => {
		assert.equal(subject.balance().available, BigNumber.make(22019458509));
	});

	it("should have the nonce", () => {
		assert.equal(subject.nonce(), BigNumber.make(24242));
	});

	it("should have a method to know if wallet is multisignature", () => {
		assert.false(subject.isMultiSignature());
	});

	it("should have a method to know if wallet is delegate", () => {
		assert.false(subject.isDelegate());
	});

	it("should have a method to know if wallet is second signature", () => {
		assert.false(subject.isSecondSignature());
	});

	it("should have a method to know if wallet is a resigned delegate", () => {
		assert.false(subject.isResignedDelegate());
	});
});
