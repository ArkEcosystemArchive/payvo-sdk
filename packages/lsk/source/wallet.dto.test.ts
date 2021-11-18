import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService, requireModule } from "../test/mocking.js";
import { expect } from "@jest/globals";

let subject: WalletData;

describe("WalletData", () => {
	test.before.each(async () => (subject = (await createService(WalletData)).fill(Fixture.data[0])));

	test("#address", () => {
		assert.is(subject.address(), "lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr");
	});

	test("#publicKey", () => {
		assert.is(subject.publicKey(), "414934d5c70dec65c4c01ddef4cb131913cc53b18e0c1c375857a5e7db52484b");
	});

	test("#balance", () => {
		assert.is(subject.balance().total instanceof BigNumber);
		assert.is(subject.balance().total.toHuman(), 1509.94716);

		assert.is(subject.balance().available instanceof BigNumber);
		assert.is(subject.balance().available.toHuman(), 1489.94716);

		assert.is(subject.balance().fees instanceof BigNumber);
		assert.is(subject.balance().fees.toHuman(), 1489.94716);

		assert.is(subject.balance().locked instanceof BigNumber);
		assert.is(subject.balance().locked?.toHuman(), 20);

		assert.is(subject.balance().lockedVotes instanceof BigNumber);
		assert.is(subject.balance().lockedVotes?.toHuman(), 10);

		assert.is(subject.balance().lockedUnvotes instanceof BigNumber);
		assert.is(subject.balance().lockedUnvotes?.toHuman(), 10);
	});

	test("#isDelegate", () => {
		assert.is(subject.isDelegate(), true);
	});

	describe("#multiSignature", () => {
		it("should throw error if wallet has not registered multi-signature", () => {
			assert
				.is(() => subject.multiSignature())
				.toThrowError("This wallet does not have a multi-signature registered.");
		});
	});

	describe("#votes", () => {
		it("should return number of votes received", () => {
			assert.is(subject.votes().toHuman(), 0);
		});

		it("should default to 0", async () => {
			const votes = (await createService(WalletData)).fill({}).votes().toHuman();

			assert.is(votes, 0);
		});
	});
});
