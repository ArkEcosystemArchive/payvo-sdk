import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";

describe("SignedTransactionData", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.transaction = {
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

		context.subject = await createService(SignedTransactionData);
		context.subject.configure(context.transaction.id, context.transaction, context.transaction);
	});

	it("should have an id", (context) => {
		assert.is(context.subject.id(), context.transaction.id);
	});

	it("should have a sender", (context) => {
		assert.is(context.subject.sender(), context.transaction.asset.recipientAddress);
	});

	it("returns the recipient address", (context) => {
		assert.is(context.subject.recipient(), context.transaction.asset.recipientAddress);
	});

	it("returns the recipient address when it's buffer", async (context) => {
		const subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
				asset: {
					recipientAddress: Buffer.from([
						118, 60, 25, 27, 10, 77, 5, 117, 2, 12, 225, 230, 80, 3, 117, 214, 208, 189, 212, 94,
					]),
				},
			},
			context.transaction,
		);

		assert.is(subject.recipient(), "lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7");
	});

	it("returns transaction amount", (context) => {
		assert.instance(context.subject.amount(), BigNumber);
		assert.is(context.subject.amount().toString(), "100000000");
	});

	it("returns sum of unlock objects amounts if type is unlockToken", async (context) => {
		const subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
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
			context.transaction,
		);

		assert.instance(subject.amount(), BigNumber);
		assert.is(subject.amount().toString(), "5000000000");
	});

	it("should have fee", (context) => {
		assert.instance(context.subject.fee(), BigNumber);
		assert.is(context.subject.fee().toString(), "207000");
	});

	it("should have timestamp", (context) => {
		assert.instance(context.subject.timestamp(), DateTime);
	});

	it("should have a method to know if transaction is transfer", async (context) => {
		assert.true(context.subject.isTransfer());

		context.subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
				moduleID: 0,
				assetID: 0,
			},
			context.transaction,
		);

		assert.false(context.subject.isTransfer());
	});

	it("should have a method to know if transaction is second signature", (context) => {
		assert.false(context.subject.isSecondSignature());
	});

	it("should have a method to know if transaction is delegate registration", async (context) => {
		assert.false(context.subject.isDelegateRegistration());

		context.subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
				moduleID: 5,
				assetID: 0,
				asset: {
					username: "a",
				},
			},
			context.transaction,
		);

		assert.true(context.subject.isDelegateRegistration());
	});

	it("should have a method to know if transaction is vote combination", async (context) => {
		assert.false(context.subject.isVoteCombination());

		context.subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
				moduleID: 5,
				assetID: 1,
				asset: {
					votes: [{ amount: 1 }, { amount: -1 }],
				},
			},
			context.transaction,
		);

		assert.true(context.subject.isVoteCombination());
	});

	it("should have a method to know if transaction is vote", async (context) => {
		assert.false(context.subject.isVote());

		context.subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
				moduleID: 5,
				assetID: 1,
				asset: {
					votes: [{ amount: 1 }],
				},
			},
			context.transaction,
		);

		assert.true(context.subject.isVote());
	});

	it("should have a method to know if transaction is unvote", async (context) => {
		assert.false(context.subject.isUnvote());

		context.subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
				moduleID: 5,
				assetID: 1,
				asset: {
					votes: [{ amount: -1 }],
				},
			},
			context.transaction,
		);

		assert.true(context.subject.isUnvote());
	});

	it("should have a method to know if transaction is unlock token", async (context) => {
		assert.false(context.subject.isUnlockToken());

		context.subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
				moduleID: 5,
				assetID: 2,
			},
			context.transaction,
		);

		assert.true(context.subject.isUnlockToken());
	});

	it("should have a method to know if transaction is multisignature registration", async (context) => {
		assert.false(context.subject.isMultiSignatureRegistration());

		context.subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
				moduleID: 4,
				assetID: 0,
			},
			context.transaction,
		);

		assert.true(context.subject.isMultiSignatureRegistration());
	});

	it("should have a method to know if transaction uses multisignature", async (context) => {
		assert.true(context.subject.usesMultiSignature());

		context.subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
				signatures: undefined,
			},
			context.transaction,
		);

		assert.false(context.subject.usesMultiSignature());
	});

	it("should have an username", async (context) => {
		assert.undefined(context.subject.username());

		context.subject = await createService(SignedTransactionData).configure(
			context.transaction.id,
			{
				...context.transaction,
				moduleID: 5,
				assetID: 0,
				asset: {
					username: "a",
				},
			},
			context.transaction,
		);

		assert.is(context.subject.username(), "a");
	});
});
