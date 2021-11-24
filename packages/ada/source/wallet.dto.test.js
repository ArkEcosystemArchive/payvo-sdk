import { describe } from "@payvo/sdk-test";
import Fixture from "../test/fixtures/client/wallet.json";
import { createService } from "../test/mocking";
import { WalletData } from "./wallet.dto";

let subject;

describe("WalletData", async ({ assert, beforeAll, it }) => {
	beforeAll(async () => {
		subject = (await createService(WalletData)).fill(Fixture);
	});

	it("should have an address", () => {
		assert.is(subject.address(), "98c83431e94407bc0889e09953461fe5cecfdf18");
	});

	it("should have the balance", () => {
		assert.is(subject.balance().available.toString(), "2000000000");
		assert.is(subject.balance().fees.toString(), "0");
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
