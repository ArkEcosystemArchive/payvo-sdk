import "jest-extended";

import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";

let subject: SignedTransactionData;

describe("2.0", () => {
	const transaction = {
		id: "12385936261751136908",
		blockId: undefined,
		height: undefined,
		relays: undefined,
		confirmations: undefined,
		amount: 1,
		type: 0,
		timestamp: 133697283,
		senderPublicKey: "ceb7bb7475a14b729eba069dfb27715331727a910acf5773a950ed4f863c89ed",
		senderId: "15957226662510576840L",
		recipientId: "15957226662510576840L",
		recipientPublicKey: undefined,
		fee: "10000000",
		signature:
			"e5224b561952cd798edb930c35a352b741ceb5b712cedaa3b51bfefd25f1e81208fdb0c10e32f0f98110aebfb657012c6f8269c968672893769187e7eb681d08",
		signSignature: undefined,
		signatures: [],
		asset: {},
		receivedAt: undefined,
	};

	beforeEach(async () => {
		subject = await createService(SignedTransactionData);
		subject.configure(transaction.id, transaction, transaction);
	});

	test("#id", () => {
		expect(subject.id()).toBe(transaction.id);
	});

	test("#sender", () => {
		expect(subject.sender()).toBe(transaction.senderId);
	});

	test("#recipient", () => {
		expect(subject.recipient()).toBe(transaction.recipientId);
	});

	test("#amount", () => {
		expect(subject.amount()).toBeInstanceOf(BigNumber);
		expect(subject.amount().toString()).toMatchInlineSnapshot(`"1"`);
	});

	test("#fee", () => {
		expect(subject.fee()).toBeInstanceOf(BigNumber);
		expect(subject.fee().toString()).toMatchInlineSnapshot(`"10000000"`);
	});

	test("#timestamp", () => {
		expect(subject.timestamp()).toBeInstanceOf(DateTime);
		expect(subject.timestamp().toString()).toMatchInlineSnapshot(`"Wed, 19 Aug 2020 03:08:03 GMT"`);
	});

	test("#isTransfer", async () => {
		expect(subject.isTransfer()).toBeTrue();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				type: 10,
			},
			transaction,
		);

		expect(subject.isTransfer()).toBeFalse();
	});

	test("#isSecondSignature", async () => {
		expect(subject.isSecondSignature()).toBeFalse();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				type: 1,
			},
			transaction,
		);

		expect(subject.isSecondSignature()).toBeTrue();
	});

	test("#isDelegateRegistration", async () => {
		expect(subject.isDelegateRegistration()).toBeFalse();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				type: 2,
			},
			transaction,
		);

		expect(subject.isDelegateRegistration()).toBeTrue();
	});

	test("#isVoteCombination", async () => {
		expect(subject.isVoteCombination()).toBeFalse();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				type: 3,
				asset: {
					votes: ["+a", "-a"],
				},
			},
			transaction,
		);

		expect(subject.isVoteCombination()).toBeTrue();
	});

	test("#isVote", async () => {
		expect(subject.isVote()).toBeFalse();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				type: 3,
				asset: {
					votes: ["+a"],
				},
			},
			transaction,
		);

		expect(subject.isVote()).toBeTrue();
	});

	test("#isUnvote", async () => {
		expect(subject.isUnvote()).toBeFalse();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				type: 3,
				asset: {
					votes: ["-a"],
				},
			},
			transaction,
		);

		expect(subject.isUnvote()).toBeTrue();
	});

	test("#isMultiSignatureRegistration", async () => {
		expect(subject.isMultiSignatureRegistration()).toBeFalse();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				type: 4,
			},
			transaction,
		);

		expect(subject.isMultiSignatureRegistration()).toBeTrue();
	});

	test("#usesMultiSignature", async () => {
		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				multiSignature: {},
			},
			transaction,
		);

		expect(subject.usesMultiSignature()).toBeTrue();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				multiSignature: undefined,
			},
			transaction,
		);

		expect(subject.usesMultiSignature()).toBeFalse();
	});
});

describe("3.0", () => {
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

	beforeEach(async () => {
		subject = await createService(SignedTransactionData);
		subject.configure(transaction.id, transaction, transaction);
	});

	test("#id", () => {
		expect(subject.id()).toBe(transaction.id);
	});

	test("#sender", () => {
		expect(subject.sender()).toBe(transaction.asset.recipientAddress);
	});

	test("#recipient", () => {
		expect(subject.recipient()).toBe(transaction.asset.recipientAddress);
	});

	test("#amount", async () => {
		expect(subject.amount()).toBeInstanceOf(BigNumber);
		expect(subject.amount().toString()).toMatchInlineSnapshot(`"100000000"`);

		// unlockToken
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

		expect(subject.amount()).toBeInstanceOf(BigNumber);
		expect(subject.amount().toString()).toMatchInlineSnapshot(`"5000000000"`);
	});

	test("#fee", () => {
		expect(subject.fee()).toBeInstanceOf(BigNumber);
		expect(subject.fee().toString()).toMatchInlineSnapshot(`"207000"`);
	});

	test("#timestamp", () => {
		expect(subject.timestamp()).toBeInstanceOf(DateTime);
		expect(subject.timestamp().toString()).toMatchInlineSnapshot(`"Invalid Date"`);
	});

	test("#isTransfer", async () => {
		expect(subject.isTransfer()).toBeTrue();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 0,
				assetID: 0,
			},
			transaction,
		);

		expect(subject.isTransfer()).toBeFalse();
	});

	test("#isSecondSignature", () => {
		expect(subject.isSecondSignature()).toBeFalse();
	});

	test("#isDelegateRegistration", async () => {
		expect(subject.isDelegateRegistration()).toBeFalse();

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

		expect(subject.isDelegateRegistration()).toBeTrue();
	});

	test("#isVoteCombination", async () => {
		expect(subject.isVoteCombination()).toBeFalse();

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

		expect(subject.isVoteCombination()).toBeTrue();
	});

	test("#isVote", async () => {
		expect(subject.isVote()).toBeFalse();

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

		expect(subject.isVote()).toBeTrue();
	});

	test("#isUnvote", async () => {
		expect(subject.isUnvote()).toBeFalse();

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

		expect(subject.isUnvote()).toBeTrue();
	});

	test("#isUnlockToken", async () => {
		expect(subject.isUnlockToken()).toBeFalse();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 5,
				assetID: 2,
			},
			transaction,
		);

		expect(subject.isUnlockToken()).toBeTrue();
	});

	test("#isMultiSignatureRegistration", async () => {
		expect(subject.isMultiSignatureRegistration()).toBeFalse();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				moduleID: 4,
				assetID: 0,
			},
			transaction,
		);

		expect(subject.isMultiSignatureRegistration()).toBeTrue();
	});

	test("#usesMultiSignature", async () => {
		expect(subject.usesMultiSignature()).toBeTrue();

		subject = await createService(SignedTransactionData).configure(
			transaction.id,
			{
				...transaction,
				signatures: undefined,
			},
			transaction,
		);

		expect(subject.usesMultiSignature()).toBeFalse();
	});
});
