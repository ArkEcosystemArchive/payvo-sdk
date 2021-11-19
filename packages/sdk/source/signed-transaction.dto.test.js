/* eslint-disable */

import { assert, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

test("#setAttributes", () => {
	let transaction = new Transaction().configure("id", { key: "value" }, "");
	assert.is(transaction.id(), "id");

	transaction.setAttributes({ identifier: "new" });
	assert.is(transaction.id(), "new");

	transaction = new Transaction().configure("id", { key: "value" }, "", 2);
	assert.instance(transaction, Transaction);

	transaction = new Transaction().configure("id", { key: "value" }, "", "2");
	assert.instance(transaction, Transaction);
});

test("#id", () => {
	assert.is(new Transaction().configure("id", { key: "value" }, "").id(), "id");
});

test("#sender", () => {
	assert.is(new Transaction().configure("id", { key: "value" }, "").sender(), "sender");
});

test("#recipient", () => {
	assert.is(new Transaction().configure("id", { key: "value" }, "").recipient(), "recipient");
});

test("#amount", () => {
	assert.equal(new Transaction().configure("id", { key: "value" }, "").amount(), BigNumber.ZERO);
});

test("#fee", () => {
	assert.equal(new Transaction().configure("id", { key: "value" }, "").fee(), BigNumber.ZERO);
});

test("#timestamp", () => {
	assert.equal(new Transaction().configure("id", { key: "value" }, "").timestamp(), DateTime.make(0));
});

test("#get", () => {
	assert.is(new Transaction().configure("id", { key: "value" }, "").get("key"), "value");
});

test("#toString", () => {
	assert
		.string(new Transaction().configure("id", JSON.stringify({ key: "value" }), "").toString())
	assert
		.string(new Transaction().configure("id", { key: "value" }, "").toString())
});

test("#toObject", () => {
	assert.object(new Transaction().configure("id", { key: "value" }, "").toObject());
});

class Transaction extends AbstractSignedTransactionData {
	sender() {
		return "sender";
	}

	recipient() {
		return "recipient";
	}

	amount() {
		return BigNumber.ZERO;
	}

	fee() {
		return BigNumber.ZERO;
	}

	timestamp() {
		return DateTime.make(0);
	}
}
