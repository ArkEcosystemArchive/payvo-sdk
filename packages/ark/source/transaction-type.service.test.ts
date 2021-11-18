import { TransactionTypeService } from "./transaction-type.service.js";

describe("TransactionTypeService", () => {
	test("#isTransfer", () => {
		assert.is(TransactionTypeService.isTransfer({ type: 0 }), true);
		assert.is(TransactionTypeService.isTransfer({ type: 1 }), false);
	});

	test("#isSecondSignature", () => {
		assert.is(TransactionTypeService.isSecondSignature({ type: 1 }), true);
		assert.is(TransactionTypeService.isSecondSignature({ type: 0 }), false);
	});

	test("#isDelegateRegistration", () => {
		assert.is(TransactionTypeService.isDelegateRegistration({ type: 2 }), true);
		assert.is(TransactionTypeService.isDelegateRegistration({ type: 0 }), false);
	});

	test("#isVoteCombination", () => {
		assert.is(TransactionTypeService.isVoteCombination({ type: 3, asset: { votes: ["+a", "-a"] } }), true);
		assert.is(TransactionTypeService.isVoteCombination({ type: 0 }), false);
	});

	test("#isVote", () => {
		assert.is(TransactionTypeService.isVote({ type: 3, asset: { votes: ["+a"] } }), true);
		assert.is(TransactionTypeService.isVote({ type: 3 }), false);
		assert.is(TransactionTypeService.isVote({ type: 0 }), false);
	});

	test("#isUnvote", () => {
		assert.is(TransactionTypeService.isUnvote({ type: 3, asset: { votes: ["-a"] } }), true);
		assert.is(TransactionTypeService.isUnvote({ type: 3 }), false);
		assert.is(TransactionTypeService.isUnvote({ type: 0 }), false);
	});

	test("#isMultiSignatureRegistration", () => {
		assert.is(TransactionTypeService.isMultiSignatureRegistration({ type: 4 }), true);
		assert.is(TransactionTypeService.isMultiSignatureRegistration({ type: 0 }), false);
	});

	test("#isIpfs", () => {
		assert.is(TransactionTypeService.isIpfs({ type: 5 }), true);
		assert.is(TransactionTypeService.isIpfs({ type: 0 }), false);
	});

	test("#isMultiPayment", () => {
		assert.is(TransactionTypeService.isMultiPayment({ type: 6 }), true);
		assert.is(TransactionTypeService.isMultiPayment({ type: 0 }), false);
	});

	test("#isDelegateResignation", () => {
		assert.is(TransactionTypeService.isDelegateResignation({ type: 7 }), true);
		assert.is(TransactionTypeService.isDelegateResignation({ type: 0 }), false);
	});

	test("#isHtlcLock", () => {
		assert.is(TransactionTypeService.isHtlcLock({ type: 8 }), true);
		assert.is(TransactionTypeService.isHtlcLock({ type: 0 }), false);
	});

	test("#isHtlcClaim", () => {
		assert.is(TransactionTypeService.isHtlcClaim({ type: 9 }), true);
		assert.is(TransactionTypeService.isHtlcClaim({ type: 0 }), false);
	});

	test("#isHtlcRefund", () => {
		assert.is(TransactionTypeService.isHtlcRefund({ type: 10 }), true);
		assert.is(TransactionTypeService.isHtlcRefund({ type: 0 }), false);
	});

	test("#isMagistrate", () => {
		assert.is(TransactionTypeService.isMagistrate({ typeGroup: 2 }), true);
		assert.is(TransactionTypeService.isMagistrate({ typeGroup: 1 }), false);
	});
});
