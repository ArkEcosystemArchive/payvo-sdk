/* eslint-disable */

import { describe } from "@payvo/sdk-test";
import { BigNumber } from "@payvo/sdk-helpers";

import { Container } from "./container.js";
import { BigNumberService } from "./big-number.service.js";
import { AbstractConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { BindingType } from "./service-provider.contract.js";
import { ConfigRepository } from "./config.js";

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

describe("AbstractConfirmedTransactionData", ({ assert, beforeEach, it, stub }) => {
	beforeEach((context) => {
		const container = new Container();
		container.singleton(BindingType.ConfigRepository, ConfigRepository);
		container.singleton(BindingType.BigNumberService, BigNumberService);

		context.subject = new Transaction(container);
	});

	it("#withDecimals", (context) => {
		assert.instance(context.subject.configure({ key: "value" }).withDecimals(2), Transaction);
		assert.instance(context.subject.configure({ key: "value" }).withDecimals("2"), Transaction);
	});

	it("should have a id", (context) => {
		assert.is(context.subject.configure({ key: "value" }).id(), "id");
	});

	it("should have a blockId", (context) => {
		assert.is(context.subject.configure({ key: "value" }).blockId(), "blockId");
	});

	it("should have a type", (context) => {
		context.subject = context.subject.configure({ key: "value" });

		assert.is(context.subject.type(), "transfer");

		stub(context.subject, "isMagistrate").returnValueOnce(true);

		assert.is(context.subject.type(), "magistrate");
	});

	it("should have a timestamp", (context) => {
		assert.undefined(context.subject.configure({ key: "value" }).timestamp());
	});

	it("should have a confirmations", (context) => {
		assert.is(context.subject.configure({ key: "value" }).confirmations(), BigNumber.ZERO);
	});

	it("should have a sender", (context) => {
		assert.is(context.subject.configure({ key: "value" }).sender(), "sender");
	});

	it("should have a recipient", (context) => {
		assert.is(context.subject.configure({ key: "value" }).recipient(), "recipient");
	});

	it("should have a recipients", (context) => {
		assert.equal(context.subject.configure({ key: "value" }).recipients(), []);
	});

	it("should have a amount", (context) => {
		assert.equal(context.subject.configure({ key: "value" }).amount(), BigNumber.ZERO);
	});

	it("should have a fee", (context) => {
		assert.equal(context.subject.configure({ key: "value" }).fee(), BigNumber.ZERO);
	});

	it("should have a memo", (context) => {
		assert.is(context.subject.configure({ key: "value" }).memo(), "memo");
		assert.undefined(context.subject.configure({ memo: "" }).memo());
		assert.is(context.subject.configure({ memo: "pedo" }).memo(), "****");
		assert.is(context.subject.configure({ memo: "pedophile" }).memo(), "*********");
		assert.undefined(context.subject.configure({ memo: "zyva.org" }).memo());
	});

	it("should have a asset", (context) => {
		assert.equal(context.subject.configure({ key: "value" }).asset(), {});
	});

	it("should determine if the transaction is a confirmed", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isConfirmed());
	});

	it("should determine if the transaction is a sent", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isSent());
	});

	it("should determine if the transaction is a received", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isReceived());
	});

	it("should determine if the transaction is a transfer", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isTransfer());
	});

	it("should determine if the transaction is a second signature", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isSecondSignature());
	});

	it("should determine if the transaction is a delegate registration", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isDelegateRegistration());
	});

	it("should determine if the transaction is a vote combination", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isVoteCombination());
	});

	it("should determine if the transaction is a vote", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isVote());
	});

	it("should determine if the transaction is a unvote", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isUnvote());
	});

	it("should determine if the transaction is a multi signature registration", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isMultiSignatureRegistration());
	});

	it("should determine if the transaction is a ipfs", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isIpfs());
	});

	it("should determine if the transaction is a multi payment", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isMultiPayment());
	});

	it("should determine if the transaction is a delegate resignation", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isDelegateResignation());
	});

	it("should determine if the transaction is a magistrate", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isMagistrate());
	});

	it("should determine if the transaction is a unlock token", (context) => {
		assert.false(context.subject.configure({ key: "value" }).isUnlockToken());
	});

	it("should transform the data into a normalised object", (context) => {
		assert.object(context.subject.configure({ key: "value" }).toObject());
	});

	it("should get the raw response data", (context) => {
		assert.equal(context.subject.configure({ key: "value" }).raw(), {
			key: "value",
		});
	});

	it("should determine if the transaction contains data", (context) => {
		assert.true(context.subject.configure({ key: "value" }).hasPassed());
		assert.false(context.subject.configure({}).hasPassed());
	});

	it("should determine if the transaction does not contain data", (context) => {
		assert.true(context.subject.configure({}).hasFailed());
		assert.false(context.subject.configure({ key: "value" }).hasFailed());
	});

	it("should set and get meta data", (context) => {
		context.subject = context.subject.configure({});

		assert.undefined(context.subject.getMeta("key"));

		context.subject.setMeta("key", "value");

		assert.is(context.subject.getMeta("key"), "value");
	});
});
