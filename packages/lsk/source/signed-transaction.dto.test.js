import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";

let subject;

const transaction = {
	moduleID: 2,
	assetID: 0,
	senderPublicKey: "5e93fd5cfe306ea2c34d7082a6c79692cf2f5c6e07aa6f9b4a11b4917d33f16b",
	nonce: "3",
	fee: "207000",
	signatures: [
		"64e1c880e844f970e46ebdcc7c9c89a80bf8618de82706f3873ee91fa666657de610a8899f1370664721cdcb08eb5ac1e12aa6e1611b85a12050711aca478604",
		"284cbea6e9a5c639981c50c97e09ea882a1cd63e2da30a99fdb961d6b4f7a3cecebf97161a8b8e22d02506fa78b119358faea83b19580e0a23d283d6e7868702",
	],
	asset: { recipientAddress: "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7", amount: "100000000", data: "" },
	id: "3279be353158ae19d47191605c82b6e112980c888e98e75d6185c858359428e4",
};

describe("SignedTransactionData", async ({ beforeEach, it, assert }) => {
	beforeEach(async () => {
		subject = await createService(SignedTransactionData);
		subject.configure(transaction.id, transaction, transaction);
	});

	it("should have an id", () => {
		assert.is(subject.id(), transaction.id);
	});

	it("should have a sender", () => {
		assert.is(subject.sender(), transaction.asset.recipientAddress);
	});

	it("returns the recipient address", () => {
		assert.is(subject.recipient(), transaction.asset.recipientAddress);
	});

	it("returns the recipient address when it's buffer", async () => {
		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				asset: {
					recipientAddress: Buffer.from([
						118, 60, 25, 27, 10, 77, 5, 117, 2, 12, 225, 230, 80, 3, 117, 214, 208, 189, 212, 94,
					]),
				},
			},
			transaction,
		);

		assert.is(subject.recipient(), "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7");
	});

	it("returns transaction amount", () => {
		assert.instance(subject.amount(), BigNumber);
		assert.is(subject.amount().toString(), "100000000");
	});

	it("returns sum of unlock objects amounts if type is unlockToken", async () => {
		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 5,
				assetID: 2,
				asset: {
					unlockObjects: [
						{
							delegateAddress: "lskc579agejjw3fo9nvgg85r8vo6sa5xojtw9qscj",
							amount: "2000000000",
							unvoteHeight: 14548930,
						},
						{
							delegateAddress: "8c955e70d0da3e0424abc4c0683280232f41c48b",
							amount: "3000000000",
							unvoteHeight: 14548929,
						},
					],
				},
			},
			transaction,
		);

		assert.instance(subject.amount(), BigNumber);
		assert.is(subject.amount().toString(), "5000000000");
	});

	it("should have fee", () => {
		assert.instance(subject.fee(), BigNumber);
		assert.is(subject.fee().toString(), "207000");
	});

	it.skip("should have timestamp", () => {
		assert.instance(subject.timestamp(), DateTime);
	});

	it("should have a method to know if transaction is transfer", async () => {
		assert.true(subject.isTransfer());

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 0,
				assetID: 0,
			},
			transaction,
		);

		assert.false(subject.isTransfer());
	});

	it("should have a method to know if transaction is second signature", () => {
		assert.false(subject.isSecondSignature());
	});

	it("should have a method to know if transaction is delegate registration", async () => {
		assert.false(subject.isDelegateRegistration());

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 5,
				assetID: 0,
				asset: {
					username: "a",
				},
			},
			transaction,
		);

		assert.true(subject.isDelegateRegistration());
	});

	it("should have a method to know if transaction is vote combination", async () => {
		assert.false(subject.isVoteCombination());

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 5,
				assetID: 1,
				asset: {
					votes: [{ amount: 1 }, { amount: -1 }],
				},
			},
			transaction,
		);

		assert.true(subject.isVoteCombination());
	});

	it("should have a method to know if transaction is vote", async () => {
		assert.false(subject.isVote());

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 5,
				assetID: 1,
				asset: {
					votes: [{ amount: 1 }],
				},
			},
			transaction,
		);

		assert.true(subject.isVote());
	});

	it("should have a method to know if transaction is unvote", async () => {
		assert.false(subject.isUnvote());

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 5,
				assetID: 1,
				asset: {
					votes: [{ amount: -1 }],
				},
			},
			transaction,
		);

		assert.true(subject.isUnvote());
	});

	it("should have a method to know if transaction is unlock token", async () => {
		assert.false(subject.isUnlockToken());

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 5,
				assetID: 2,
			},
			transaction,
		);

		assert.true(subject.isUnlockToken());
	});

	it("should have a method to know if transaction is multisignature registration", async () => {
		assert.false(subject.isMultiSignatureRegistration());

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 4,
				assetID: 0,
			},
			transaction,
		);

		assert.true(subject.isMultiSignatureRegistration());
	});

	it("should have a method to know if transaction uses multisignature", async () => {
		assert.true(subject.usesMultiSignature());

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				signatures: undefined,
			},
			transaction,
		);

		assert.false(subject.usesMultiSignature());
	});

	it("should have an username", async () => {
		assert.undefined(subject.username());

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 5,
				assetID: 0,
				asset: {
					username: "a",
				},
			},
			transaction,
		);

		assert.is(subject.username(), "a");
	});
});
