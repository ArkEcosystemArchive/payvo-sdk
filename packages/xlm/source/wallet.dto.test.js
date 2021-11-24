import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

let subject;

describe("WalletData", async ({ beforeAll, assert, it }) => {
	beforeAll(async () => {
		subject = (await createService(WalletData)).fill(Fixture);
	});

	it("should have an address", () => {
		assert.is(subject.address(), "GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB");
	});

	it("should have a publicKey", () => {
		assert.is(subject.publicKey(), "GD42RQNXTRIW6YR3E2HXV5T2AI27LBRHOERV2JIYNFMXOBA234SWLQQB");
	});

	it("should have a balance", () => {
		assert.equal(subject.balance().available, BigNumber.make("17491629"));
	});

	it("should have a nonce", () => {
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

	it("should have a method to know if wallet is resigned delegate", () => {
		assert.false(subject.isResignedDelegate());
	});
});
