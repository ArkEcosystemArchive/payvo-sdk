import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";
import { expect } from "@jest/globals";

let subject: WalletData;

describe("WalletData", () => {
	beforeEach(async () => (subject = (await createService(WalletData)).fill(Fixture.data[0])));

	test("#address", () => {
		expect(subject.address()).toBe("lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr");
	});

	test("#publicKey", () => {
		expect(subject.publicKey()).toBe("414934d5c70dec65c4c01ddef4cb131913cc53b18e0c1c375857a5e7db52484b");
	});

	test("#balance", () => {
		expect(subject.balance().total).toBeInstanceOf(BigNumber);
		expect(subject.balance().total.toHuman()).toBe(1509.94716);

		expect(subject.balance().available).toBeInstanceOf(BigNumber);
		expect(subject.balance().available.toHuman()).toBe(1489.94716);

		expect(subject.balance().fees).toBeInstanceOf(BigNumber);
		expect(subject.balance().fees.toHuman()).toBe(1489.94716);

		expect(subject.balance().locked).toBeInstanceOf(BigNumber);
		expect(subject.balance().locked?.toHuman()).toBe(20);

		expect(subject.balance().lockedVotes).toBeInstanceOf(BigNumber);
		expect(subject.balance().lockedVotes?.toHuman()).toBe(10);

		expect(subject.balance().lockedUnvotes).toBeInstanceOf(BigNumber);
		expect(subject.balance().lockedUnvotes?.toHuman()).toBe(10);
	});

	test("#isDelegate", () => {
		expect(subject.isDelegate()).toBe(true);
	});

	describe("#multiSignature", () => {
		it("should throw error if wallet has not registered multi-signature", () => {
			expect(() => subject.multiSignature()).toThrowError(
				"This wallet does not have a multi-signature registered.",
			);
		});
	});

	describe("#votes", () => {
		it("should return number of votes received", () => {
			expect(subject.votes().toHuman()).toBe(0);
		});

		it("should default to 0", async () => {
			const votes = (await createService(WalletData)).fill({}).votes().toHuman();

			expect(votes).toBe(0);
		});
	});
});
