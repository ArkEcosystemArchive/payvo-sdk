import { describe } from "@payvo/sdk-test";
import { TransactionTypeService } from "./transaction-type.service.js";

describe("TransactionTypeService", async ({ assert, it, nock, loader }) => {
	it("should determine if the transaction is a transfer", () => {
		assert.true(TransactionTypeService.isTransfer({ type: 0 }));
		assert.false(TransactionTypeService.isTransfer({ type: 1 }));
	});

	it("should determine if the transaction is a second signature", () => {
		assert.true(TransactionTypeService.isSecondSignature({ type: 1 }));
		assert.false(TransactionTypeService.isSecondSignature({ type: 0 }));
	});

	it("should determine if the transaction is a delegate registration", () => {
		assert.true(TransactionTypeService.isDelegateRegistration({ type: 2 }));
		assert.false(TransactionTypeService.isDelegateRegistration({ type: 0 }));
	});

	it("should determine if the transaction is a vote combination", () => {
		assert.true(TransactionTypeService.isVoteCombination({ type: 3, asset: { votes: ["+a", "-a"] } }));
		assert.false(TransactionTypeService.isVoteCombination({ type: 0 }));
	});

	it("should determine if the transaction is a vote", () => {
		assert.true(TransactionTypeService.isVote({ type: 3, asset: { votes: ["+a"] } }));
		assert.false(TransactionTypeService.isVote({ type: 3 }));
		assert.false(TransactionTypeService.isVote({ type: 0 }));
	});

	it("should determine if the transaction is a unvote", () => {
		assert.true(TransactionTypeService.isUnvote({ type: 3, asset: { votes: ["-a"] } }));
		assert.false(TransactionTypeService.isUnvote({ type: 3 }));
		assert.false(TransactionTypeService.isUnvote({ type: 0 }));
	});

	it("should determine if the transaction is a multi signature registration", () => {
		assert.true(TransactionTypeService.isMultiSignatureRegistration({ type: 4 }));
		assert.false(TransactionTypeService.isMultiSignatureRegistration({ type: 0 }));
	});

	it("should determine if the transaction is a ipfs", () => {
		assert.true(TransactionTypeService.isIpfs({ type: 5 }));
		assert.false(TransactionTypeService.isIpfs({ type: 0 }));
	});

	it("should determine if the transaction is a multi payment", () => {
		assert.true(TransactionTypeService.isMultiPayment({ type: 6 }));
		assert.false(TransactionTypeService.isMultiPayment({ type: 0 }));
	});

	it("should determine if the transaction is a delegate resignation", () => {
		assert.true(TransactionTypeService.isDelegateResignation({ type: 7 }));
		assert.false(TransactionTypeService.isDelegateResignation({ type: 0 }));
	});

	it("should determine if the transaction is a htlc lock", () => {
		assert.true(TransactionTypeService.isHtlcLock({ type: 8 }));
		assert.false(TransactionTypeService.isHtlcLock({ type: 0 }));
	});

	it("should determine if the transaction is a htlc claim", () => {
		assert.true(TransactionTypeService.isHtlcClaim({ type: 9 }));
		assert.false(TransactionTypeService.isHtlcClaim({ type: 0 }));
	});

	it("should determine if the transaction is a htlc refund", () => {
		assert.true(TransactionTypeService.isHtlcRefund({ type: 10 }));
		assert.false(TransactionTypeService.isHtlcRefund({ type: 0 }));
	});

	it("should determine if the transaction is a magistrate", () => {
		assert.true(TransactionTypeService.isMagistrate({ typeGroup: 2 }));
		assert.false(TransactionTypeService.isMagistrate({ typeGroup: 1 }));
	});
});
