import { BigNumber } from "@payvo/helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import FixtureLegacy0 from "../test/fixtures/client/wallet-legacy-0.json";
import FixtureLegacy1 from "../test/fixtures/client/wallet-legacy-1.json";
import { WalletData } from "./wallet.dto";
import { createService } from "../test/mocking";
import { expect } from "@jest/globals";

let subject: WalletData;

describe("WalletData", () => {
	describe.each([FixtureLegacy0, FixtureLegacy1])("2.0", (fixture) => {
		beforeEach(async () => (subject = (await createService(WalletData)).fill(fixture.data[0])));

		test("#address", async () => {
			expect(subject.address()).toBe("11603034586667438647L");
		});

		test("#publicKey", () => {
			expect(subject.publicKey()).toBe("635ec78f25eefe8dcb7b4e7f5685c5aad1fef54048c596ee4e74cdf5e7b0f37c");
		});

		test("#nonce", () => {
			expect(subject.nonce()).toBeInstanceOf(BigNumber);
			expect(subject.nonce().toHuman()).toBe(0);
		});

		test("#username", () => {
			expect(subject.username()).toBe("username");
		});

		test("#rank", () => {
			expect(subject.rank()).toBe(1);
		});

		test("#vote", () => {
			expect(subject.votes()).toBeInstanceOf(BigNumber);
			expect(subject.votes()?.toHuman()).toBe(1);
		});

		test("#multiSignature", () => {
			expect(subject.multiSignature()).toMatchSnapshot();
		});
	});

	describe("3.0", () => {
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
});
