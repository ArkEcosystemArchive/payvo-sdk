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
		assert.is(subject.address(), "bdfkbzietxos");
	});

	it("should have a public key", () => {
		assert.undefined(subject.publicKey());
	});

	it("should have a balance", () => {
		assert.equal(subject.balance().available, BigNumber.make(3050000));
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

	it("should have a method to know if wallet is a resigned delegate", () => {
		assert.false(subject.isResignedDelegate());
	});
});
