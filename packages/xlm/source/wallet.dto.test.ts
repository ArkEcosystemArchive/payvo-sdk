import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService } from "../test/mocking";

describe("WalletData", async ({ beforeAll, assert, it, nock, loader }) => {
	beforeAll(async (context) => {
		context.subject = (await createService(WalletData)).fill(Fixture);
	});

	it("should have an address", (context) => {
		assert.is(context.subject.address(), "GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB");
	});

	it("should have a publicKey", (context) => {
		assert.is(context.subject.publicKey(), "GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB");
	});

	it("should have a balance", (context) => {
		assert.equal(context.subject.balance().available, BigNumber.make("17491629"));
	});

	it("should have a nonce", (context) => {
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

	it("should have a method to know if wallet is resigned delegate", (context) => {
		assert.false(context.subject.isResignedDelegate());
	});
});
