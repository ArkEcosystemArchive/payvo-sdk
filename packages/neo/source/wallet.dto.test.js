import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";

let subject;

describe("WalletData", async ({ beforeAll, it, assert }) => {
	beforeAll(async () => {
		subject = (await createService(WalletData)).fill(Fixture);
	});

	it("should have an address", () => {
		assert.is(subject.address(), "AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF");
	});

	it("should have a publicKey", () => {
		assert.throws(() => subject.publicKey(), "not implemented");
	});

	it("should have a balance", () => {
		assert.equal(subject.balance().available, BigNumber.make(3050000));
	});

	it("should have a nonce", () => {
		assert.equal(subject.nonce(), BigNumber.make(24242));
	});

	it("should have a second public key", () => {
		assert.throws(() => subject.secondPublicKey(), "not implemented");
	});

	it("should have a username", () => {
		assert.throws(() => subject.username(), "not implemented");
	});

	it("should have a rank", () => {
		assert.throws(() => subject.rank(), "not implemented");
	});

	it("should have votes", () => {
		assert.throws(() => subject.votes(), "not implemented");
	});

	it("should have multisignature data", () => {
		assert.throws(() => subject.multiSignature(), "not implemented");
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
