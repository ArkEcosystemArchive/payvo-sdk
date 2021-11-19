/* eslint-disable */

import "reflect-metadata";

import { assert, mockery, test } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { AbstractConfirmedTransactionData } from "./confirmed-transaction";

test("#withDecimals", () => {
	assert.instance(new Transaction().configure({ key: "value" }).withDecimals(2), Transaction);
	assert.instance(new Transaction().configure({ key: "value" }).withDecimals("2"), Transaction);
});

test("#id", () => {
	assert.is(new Transaction().configure({ key: "value" }).id(), "id");
});

test("#blockId", () => {
	assert.is(new Transaction().configure({ key: "value" }).blockId(), "blockId");
});

test("#type", () => {
	const subject = new Transaction().configure({ key: "value" });

	assert.is(subject.type(), "transfer");

	mockery(true, "isMagistrate").mockReturnValueOnce(true);

	assert.is(subject.type(), "magistrate");
});

test("#timestamp", () => {
	assert.undefined(new Transaction().configure({ key: "value" }).timestamp());
});

test("#confirmations", () => {
	assert.is(new Transaction().configure({ key: "value" }).confirmations(), BigNumber.ZERO);
});

test("#sender", () => {
	assert.is(new Transaction().configure({ key: "value" }).sender(), "sender");
});

test("#recipient", () => {
	assert.is(new Transaction().configure({ key: "value" }).recipient(), "recipient");
});

test("#recipients", () => {
	assert.is(new Transaction().configure({ key: "value" }).recipients(), []);
});

test("#amount", () => {
	assert.is(new Transaction().configure({ key: "value" }).amount(), BigNumber.ZERO);
});

test("#fee", () => {
	assert.is(new Transaction().configure({ key: "value" }).fee(), BigNumber.ZERO);
});

test("#memo", () => {
	assert.is(new Transaction().configure({ key: "value" }).memo(), "memo");
	assert.undefined(new Transaction().configure({ memo: "" }).memo());
	assert.is(new Transaction().configure({ memo: "pedo" }).memo(), "****");
	assert.is(new Transaction().configure({ memo: "pedophile" }).memo(), "*********");
	assert.undefined(new Transaction().configure({ memo: "zyva.org" }).memo());
});

test("#asset", () => {
	assert.is(new Transaction().configure({ key: "value" }).asset(), {});
});

test("#isConfirmed", () => {
	assert.false(new Transaction().configure({ key: "value" }).isConfirmed());
});

test("#isSent", () => {
	assert.false(new Transaction().configure({ key: "value" }).isSent());
});

test("#isReceived", () => {
	assert.false(new Transaction().configure({ key: "value" }).isReceived());
});

test("#isTransfer", () => {
	assert.false(new Transaction().configure({ key: "value" }).isTransfer());
});

test("#isSecondSignature", () => {
	assert.false(new Transaction().configure({ key: "value" }).isSecondSignature());
});

test("#isDelegateRegistration", () => {
	assert.false(new Transaction().configure({ key: "value" }).isDelegateRegistration());
});

test("#isVoteCombination", () => {
	assert.false(new Transaction().configure({ key: "value" }).isVoteCombination());
});

test("#isVote", () => {
	assert.false(new Transaction().configure({ key: "value" }).isVote());
});

test("#isUnvote", () => {
	assert.false(new Transaction().configure({ key: "value" }).isUnvote());
});

test("#isMultiSignatureRegistration", () => {
	assert.false(new Transaction().configure({ key: "value" }).isMultiSignatureRegistration());
});

test("#isIpfs", () => {
	assert.false(new Transaction().configure({ key: "value" }).isIpfs());
});

test("#isMultiPayment", () => {
	assert.false(new Transaction().configure({ key: "value" }).isMultiPayment());
});

test("#isDelegateResignation", () => {
	assert.false(new Transaction().configure({ key: "value" }).isDelegateResignation());
});

test("#isHtlcLock", () => {
	assert.false(new Transaction().configure({ key: "value" }).isHtlcLock());
});

test("#isHtlcClaim", () => {
	assert.false(new Transaction().configure({ key: "value" }).isHtlcClaim());
});

test("#isHtlcRefund", () => {
	assert.false(new Transaction().configure({ key: "value" }).isHtlcRefund());
});

test("#isMagistrate", () => {
	assert.false(new Transaction().configure({ key: "value" }).isMagistrate());
});

test("#isUnlockToken", () => {
	assert.false(new Transaction().configure({ key: "value" }).isUnlockToken());
});

test("#toObject", () => {
	assert.object(new Transaction().configure({ key: "value" }).toObject());
});

test("#raw", () => {
	assert.equal(new Transaction().configure({ key: "value" }).raw(), {
		key: "value",
	});
});

test("#hasPassed", () => {
	assert.true(new Transaction().configure({ key: "value" }).hasPassed());
	assert.false(new Transaction().configure({}).hasPassed());
});

test("#hasFailed", () => {
	assert.true(new Transaction().configure({}).hasFailed());
	assert.false(new Transaction().configure({ key: "value" }).hasFailed());
});

test("#getMeta | #setMeta", () => {
	const subject = new Transaction().configure({});

	assert.undefined(subject.getMeta("key"));

	subject.setMeta("key", "value");

	assert.is(subject.getMeta("key"), "value");
});

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
		false;
	}

	isSent() {
		false;
	}

	isReceived() {
		false;
	}

	isTransfer() {
		false;
	}
}
