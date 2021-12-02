/* eslint-disable */

import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { AbstractConfirmedTransactionData } from "./confirmed-transaction.dto";

class Transaction extends AbstractConfirmedTransactionData {
	id() {
		return "id";
	}

	blockId() {
		return "blockId";
	}

	timestamp() {
		return undefined;
	}

	confirmations() {
		return BigNumber.ZERO;
	}

	sender() {
		return "sender";
	}

	recipient() {
		return "recipient";
	}

	recipients() {
		return [];
	}

	amount() {
		return BigNumber.ZERO;
	}

	fee() {
		return BigNumber.ZERO;
	}

	memo() {
		if (this.data.hasOwnProperty("memo")) {
			return this.censorMemo(this.data.memo);
		}

		return this.censorMemo("memo");
	}

	asset() {
		return {};
	}

	inputs() {
		return [];
	}

	outputs() {
		return [];
	}

	isConfirmed() {
		return false;
	}

	isSent() {
		return false;
	}

	isReceived() {
		return false;
	}

	isTransfer() {
		return false;
	}
}

describe("AbstractConfirmedTransactionData", ({ assert, it, stub }) => {
	it("#withDecimals", () => {
		assert.instance(new Transaction().configure({ key: "value" }).withDecimals(2), Transaction);
		assert.instance(new Transaction().configure({ key: "value" }).withDecimals("2"), Transaction);
	});

	it("should have a id", () => {
		assert.is(new Transaction().configure({ key: "value" }).id(), "id");
	});

	it("should have a blockId", () => {
		assert.is(new Transaction().configure({ key: "value" }).blockId(), "blockId");
	});

	it("should have a type", () => {
		const subject = new Transaction().configure({ key: "value" });

		assert.is(subject.type(), "transfer");

		stub(subject, "isMagistrate").returnValueOnce(true);

		assert.is(subject.type(), "magistrate");
	});

	it("should have a timestamp", () => {
		assert.undefined(new Transaction().configure({ key: "value" }).timestamp());
	});

	it("should have a confirmations", () => {
		assert.is(new Transaction().configure({ key: "value" }).confirmations(), BigNumber.ZERO);
	});

	it("should have a sender", () => {
		assert.is(new Transaction().configure({ key: "value" }).sender(), "sender");
	});

	it("should have a recipient", () => {
		assert.is(new Transaction().configure({ key: "value" }).recipient(), "recipient");
	});

	it("should have a recipients", () => {
		assert.equal(new Transaction().configure({ key: "value" }).recipients(), []);
	});

	it("should have a amount", () => {
		assert.equal(new Transaction().configure({ key: "value" }).amount(), BigNumber.ZERO);
	});

	it("should have a fee", () => {
		assert.equal(new Transaction().configure({ key: "value" }).fee(), BigNumber.ZERO);
	});

	it("should have a memo", () => {
		assert.is(new Transaction().configure({ key: "value" }).memo(), "memo");
		assert.undefined(new Transaction().configure({ memo: "" }).memo());
		assert.is(new Transaction().configure({ memo: "pedo" }).memo(), "****");
		assert.is(new Transaction().configure({ memo: "pedophile" }).memo(), "*********");
		assert.undefined(new Transaction().configure({ memo: "zyva.org" }).memo());
	});

	it("should have a asset", () => {
		assert.equal(new Transaction().configure({ key: "value" }).asset(), {});
	});

	it("should determine if the transaction is a confirmed", () => {
		assert.false(new Transaction().configure({ key: "value" }).isConfirmed());
	});

	it("should determine if the transaction is a sent", () => {
		assert.false(new Transaction().configure({ key: "value" }).isSent());
	});

	it("should determine if the transaction is a received", () => {
		assert.false(new Transaction().configure({ key: "value" }).isReceived());
	});

	it("should determine if the transaction is a transfer", () => {
		assert.false(new Transaction().configure({ key: "value" }).isTransfer());
	});

	it("should determine if the transaction is a second signature", () => {
		assert.false(new Transaction().configure({ key: "value" }).isSecondSignature());
	});

	it("should determine if the transaction is a delegate registration", () => {
		assert.false(new Transaction().configure({ key: "value" }).isDelegateRegistration());
	});

	it("should determine if the transaction is a vote combination", () => {
		assert.false(new Transaction().configure({ key: "value" }).isVoteCombination());
	});

	it("should determine if the transaction is a vote", () => {
		assert.false(new Transaction().configure({ key: "value" }).isVote());
	});

	it("should determine if the transaction is a unvote", () => {
		assert.false(new Transaction().configure({ key: "value" }).isUnvote());
	});

	it("should determine if the transaction is a multi signature registration", () => {
		assert.false(new Transaction().configure({ key: "value" }).isMultiSignatureRegistration());
	});

	it("should determine if the transaction is a ipfs", () => {
		assert.false(new Transaction().configure({ key: "value" }).isIpfs());
	});

	it("should determine if the transaction is a multi payment", () => {
		assert.false(new Transaction().configure({ key: "value" }).isMultiPayment());
	});

	it("should determine if the transaction is a delegate resignation", () => {
		assert.false(new Transaction().configure({ key: "value" }).isDelegateResignation());
	});

	it("should determine if the transaction is a magistrate", () => {
		assert.false(new Transaction().configure({ key: "value" }).isMagistrate());
	});

	it("should determine if the transaction is a unlock token", () => {
		assert.false(new Transaction().configure({ key: "value" }).isUnlockToken());
	});

	it("should transform the data into a normalised object", () => {
		assert.object(new Transaction().configure({ key: "value" }).toObject());
	});

	it("should get the raw response data", () => {
		assert.equal(new Transaction().configure({ key: "value" }).raw(), {
			key: "value",
		});
	});

	it("should determine if the transaction contains data", () => {
		assert.true(new Transaction().configure({ key: "value" }).hasPassed());
		assert.false(new Transaction().configure({}).hasPassed());
	});

	it("should determine if the transaction does not contain data", () => {
		assert.true(new Transaction().configure({}).hasFailed());
		assert.false(new Transaction().configure({ key: "value" }).hasFailed());
	});

	it("should set and get meta data", () => {
		const subject = new Transaction().configure({});

		assert.undefined(subject.getMeta("key"));

		subject.setMeta("key", "value");

		assert.is(subject.getMeta("key"), "value");
	});
});
