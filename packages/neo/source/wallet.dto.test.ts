import "jest-extended";

import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService, requireModule } from "../test/mocking.js";

let subject;

beforeAll(async () => {
	subject = (await createService(WalletData)).fill(Fixture);
});

describe("WalletData", () => {
	it("#address", () => {
		expect(subject.address()).toEqual("AStJyBXGGBK6bwrRfRUHSjp993PB5C9QgF");
	});

	it("#publicKey", () => {
		expect(() => subject.publicKey()).toThrow(/not implemented/);
	});

	it("#balance", () => {
		expect(subject.balance().available).toEqual(BigNumber.make(3050000));
	});

	it("#nonce", () => {
		expect(subject.nonce()).toEqual(BigNumber.make(24242));
	});

	it("#secondPublicKey", () => {
		expect(() => subject.secondPublicKey()).toThrow(/not implemented/);
	});

	it("#username", () => {
		expect(() => subject.username()).toThrow(/not implemented/);
	});

	it("#rank", () => {
		expect(() => subject.rank()).toThrow(/not implemented/);
	});

	it("#votes", () => {
		expect(() => subject.votes()).toThrow(/not implemented/);
	});

	it("#multiSignature", () => {
		expect(() => subject.multiSignature()).toThrow(/not implemented/);
	});

	it("#isMultiSignature", () => {
		expect(subject.isMultiSignature()).toBeFalse();
	});

	it("#isDelegate", () => {
		expect(subject.isDelegate()).toBeFalse();
	});

	it("#isSecondSignature", () => {
		expect(subject.isSecondSignature()).toBeFalse();
	});

	it("#isResignedDelegate", () => {
		expect(subject.isResignedDelegate()).toBeFalse();
	});
});
