import "jest-extended";

import { TransactionTypeService } from "./transaction-type.service.js";

describe("TransactionTypeService", () => {
	test("#isTransfer", () => {
		expect(TransactionTypeService.isTransfer({ type: 0 })).toBeTrue();
		expect(TransactionTypeService.isTransfer({ type: 1 })).toBeFalse();
	});

	test("#isSecondSignature", () => {
		expect(TransactionTypeService.isSecondSignature({ type: 1 })).toBeTrue();
		expect(TransactionTypeService.isSecondSignature({ type: 0 })).toBeFalse();
	});

	test("#isDelegateRegistration", () => {
		expect(TransactionTypeService.isDelegateRegistration({ type: 2 })).toBeTrue();
		expect(TransactionTypeService.isDelegateRegistration({ type: 0 })).toBeFalse();
	});

	test("#isVoteCombination", () => {
		expect(TransactionTypeService.isVoteCombination({ type: 3, asset: { votes: ["+a", "-a"] } })).toBeTrue();
		expect(TransactionTypeService.isVoteCombination({ type: 0 })).toBeFalse();
	});

	test("#isVote", () => {
		expect(TransactionTypeService.isVote({ type: 3, asset: { votes: ["+a"] } })).toBeTrue();
		expect(TransactionTypeService.isVote({ type: 3 })).toBeFalse();
		expect(TransactionTypeService.isVote({ type: 0 })).toBeFalse();
	});

	test("#isUnvote", () => {
		expect(TransactionTypeService.isUnvote({ type: 3, asset: { votes: ["-a"] } })).toBeTrue();
		expect(TransactionTypeService.isUnvote({ type: 3 })).toBeFalse();
		expect(TransactionTypeService.isUnvote({ type: 0 })).toBeFalse();
	});

	test("#isMultiSignatureRegistration", () => {
		expect(TransactionTypeService.isMultiSignatureRegistration({ type: 4 })).toBeTrue();
		expect(TransactionTypeService.isMultiSignatureRegistration({ type: 0 })).toBeFalse();
	});

	test("#isIpfs", () => {
		expect(TransactionTypeService.isIpfs({ type: 5 })).toBeTrue();
		expect(TransactionTypeService.isIpfs({ type: 0 })).toBeFalse();
	});

	test("#isMultiPayment", () => {
		expect(TransactionTypeService.isMultiPayment({ type: 6 })).toBeTrue();
		expect(TransactionTypeService.isMultiPayment({ type: 0 })).toBeFalse();
	});

	test("#isDelegateResignation", () => {
		expect(TransactionTypeService.isDelegateResignation({ type: 7 })).toBeTrue();
		expect(TransactionTypeService.isDelegateResignation({ type: 0 })).toBeFalse();
	});

	test("#isHtlcLock", () => {
		expect(TransactionTypeService.isHtlcLock({ type: 8 })).toBeTrue();
		expect(TransactionTypeService.isHtlcLock({ type: 0 })).toBeFalse();
	});

	test("#isHtlcClaim", () => {
		expect(TransactionTypeService.isHtlcClaim({ type: 9 })).toBeTrue();
		expect(TransactionTypeService.isHtlcClaim({ type: 0 })).toBeFalse();
	});

	test("#isHtlcRefund", () => {
		expect(TransactionTypeService.isHtlcRefund({ type: 10 })).toBeTrue();
		expect(TransactionTypeService.isHtlcRefund({ type: 0 })).toBeFalse();
	});

	test("#isMagistrate", () => {
		expect(TransactionTypeService.isMagistrate({ typeGroup: 2 })).toBeTrue();
		expect(TransactionTypeService.isMagistrate({ typeGroup: 1 })).toBeFalse();
	});
});
