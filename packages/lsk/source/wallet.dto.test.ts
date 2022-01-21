import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import Fixture from "../test/fixtures/client/wallet.json";
import { WalletData } from "./wallet.dto.js";
import { createService } from "../test/mocking";

describe("WalletData", async ({ beforeEach, assert, it, nock, loader }) => {
	beforeEach(async (context) => (context.subject = (await createService(WalletData)).fill(Fixture.data[0])));

	it("#address", (context) => {
		assert.is(context.subject.address(), "lskk8upba9sj8zsktr8hb2vcgk3quvgmx8h27h4gr");
	});

	it("#publicKey", (context) => {
		assert.is(context.subject.publicKey(), "414934d5c70dec65c4c01ddef4cb131913cc53b18e0c1c375857a5e7db52484b");
	});

	it("#balance", (context) => {
		assert.instance(context.subject.balance().total, BigNumber);
		assert.is(context.subject.balance().total.toHuman(), 1509.94716);

		assert.instance(context.subject.balance().available, BigNumber);
		assert.is(context.subject.balance().available.toHuman(), 1489.94716);

		assert.instance(context.subject.balance().fees, BigNumber);
		assert.is(context.subject.balance().fees.toHuman(), 1489.94716);

		assert.instance(context.subject.balance().locked, BigNumber);
		assert.is(context.subject.balance().locked?.toHuman(), 20);

		assert.instance(context.subject.balance().lockedVotes, BigNumber);
		assert.is(context.subject.balance().lockedVotes?.toHuman(), 10);

		assert.instance(context.subject.balance().lockedUnvotes, BigNumber);
		assert.is(context.subject.balance().lockedUnvotes?.toHuman(), 10);
	});

	it("#isDelegate", (context) => {
		assert.true(context.subject.isDelegate());
	});

	it("should throw error if wallet has not registered multi-signature", (context) => {
		assert.throws(
			() => context.subject.multiSignature(),
			"This wallet does not have a multi-signature registered.",
		);
	});

	it("should return number of votes received", (context) => {
		assert.is(context.subject.votes().toHuman(), 0);
	});

	it("should default to 0 for votes", async () => {
		const votes = (await createService(WalletData)).fill({}).votes().toHuman();

		assert.is(votes, 0);
	});
});
