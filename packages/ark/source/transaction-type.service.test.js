import { assert, test } from "@payvo/sdk-test";
import { TransactionTypeService } from "./transaction-type.service";

test("#isTransfer", () => {
	assert.true(TransactionTypeService.isTransfer({ type: 0 }));
	assert.false(TransactionTypeService.isTransfer({ type: 1 }));
});

test("#isSecondSignature", () => {
	assert.true(TransactionTypeService.isSecondSignature({ type: 1 }));
	assert.false(TransactionTypeService.isSecondSignature({ type: 0 }));
});

test("#isDelegateRegistration", () => {
	assert.true(TransactionTypeService.isDelegateRegistration({ type: 2 }));
	assert.false(TransactionTypeService.isDelegateRegistration({ type: 0 }));
});

test("#isVoteCombination", () => {
	assert.true(TransactionTypeService.isVoteCombination({ type: 3, asset: { votes: ["+a", "-a"] } }));
	assert.false(TransactionTypeService.isVoteCombination({ type: 0 }));
});

test("#isVote", () => {
	assert.true(TransactionTypeService.isVote({ type: 3, asset: { votes: ["+a"] } }));
	assert.false(TransactionTypeService.isVote({ type: 3 }));
	assert.false(TransactionTypeService.isVote({ type: 0 }));
});

test("#isUnvote", () => {
	assert.true(TransactionTypeService.isUnvote({ type: 3, asset: { votes: ["-a"] } }));
	assert.false(TransactionTypeService.isUnvote({ type: 3 }));
	assert.false(TransactionTypeService.isUnvote({ type: 0 }));
});

test("#isMultiSignatureRegistration", () => {
	assert.true(TransactionTypeService.isMultiSignatureRegistration({ type: 4 }));
	assert.false(TransactionTypeService.isMultiSignatureRegistration({ type: 0 }));
});

test("#isIpfs", () => {
	assert.true(TransactionTypeService.isIpfs({ type: 5 }));
	assert.false(TransactionTypeService.isIpfs({ type: 0 }));
});

test("#isMultiPayment", () => {
	assert.true(TransactionTypeService.isMultiPayment({ type: 6 }));
	assert.false(TransactionTypeService.isMultiPayment({ type: 0 }));
});

test("#isDelegateResignation", () => {
	assert.true(TransactionTypeService.isDelegateResignation({ type: 7 }));
	assert.false(TransactionTypeService.isDelegateResignation({ type: 0 }));
});

test("#isHtlcLock", () => {
	assert.true(TransactionTypeService.isHtlcLock({ type: 8 }));
	assert.false(TransactionTypeService.isHtlcLock({ type: 0 }));
});

test("#isHtlcClaim", () => {
	assert.true(TransactionTypeService.isHtlcClaim({ type: 9 }));
	assert.false(TransactionTypeService.isHtlcClaim({ type: 0 }));
});

test("#isHtlcRefund", () => {
	assert.true(TransactionTypeService.isHtlcRefund({ type: 10 }));
	assert.false(TransactionTypeService.isHtlcRefund({ type: 0 }));
});

test("#isMagistrate", () => {
	assert.true(TransactionTypeService.isMagistrate({ typeGroup: 2 }));
	assert.false(TransactionTypeService.isMagistrate({ typeGroup: 1 }));
});

test.run();
