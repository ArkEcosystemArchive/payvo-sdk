import "jest-extended";

import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService, requireModule } from "../test/mocking.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";

let subject: SignedTransactionData;

describe("SignedTransactionData", () => {
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

	describe("#recipient", () => {
		it("returns the recipient address", () => {
			expect(subject.recipient()).toBe(transaction.asset.recipientAddress);
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

			expect(subject.recipient()).toBe("lsk72fxrb264kvw6zuojntmzzsqds35sqvfzz76d7");
		});
	});

	describe("#amount", () => {
		it("returns transaction amount", () => {
			expect(subject.amount()).toBeInstanceOf(BigNumber);
			expect(subject.amount().toString()).toMatchInlineSnapshot(`"100000000"`);
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

			expect(subject.amount()).toBeInstanceOf(BigNumber);
			expect(subject.amount().toString()).toMatchInlineSnapshot(`"5000000000"`);
		});
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

	test("#username", async () => {
		expect(subject.username()).toBeUndefined();

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

		expect(subject.username()).toBe("a");
	});
});
