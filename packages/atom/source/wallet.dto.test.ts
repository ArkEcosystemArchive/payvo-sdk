import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService } from "../test/mocking";

describe("WalletData", async ({ beforeAll, assert, it, nock, loader }) => {
	beforeAll(async (context) => {
		context.subject = (await createService(WalletData)).fill({
			address: Fixture.result.value.address,
			publicKey: Fixture.result.value.public_key.value,
			balance: 22019458509,
			sequence: Fixture.result.value.sequence,
		});
	});

	it("should have an address", (context) => {
		assert.is(context.subject.address(), "cosmos1de7pk372jkp9vrul0gv5j6r3l9mt3wa6m4h6h0");
	});

	it("should have a publicKey", (context) => {
		assert.is(context.subject.publicKey(), "Ap65s+Jdgo8BtvTbkc7GyUti8yJ7RpZ7cE1zCuKgNeXY");
	});

	it("should have balance", (context) => {
		assert.equal(context.subject.balance().available, BigNumber.make(22019458509));
	});

	it("should have the nonce", (context) => {
		assert.equal(context.subject.nonce(), BigNumber.make(24242));
	});

	it("should have a method to know if wallet is multisignature", (context) => {
		assert.false(context.subject.isMultiSignature());
	});

	it("should have a method to know if wallet is delegate", (context) => {
		assert.false(context.subject.isDelegate());
	});

	it("should have a method to know if wallet is second signature", (context) => {
		assert.false(context.subject.isSecondSignature());
	});

	it("should have a method to know if wallet is a resigned delegate", (context) => {
		assert.false(context.subject.isResignedDelegate());
	});
});
