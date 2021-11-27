/* eslint-disable */

import { describe } from "@payvo/sdk-test";
import "reflect-metadata";

import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";
import { AbstractSignedTransactionData } from "./signed-transaction.dto";

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

describe("AbstractSignedTransactionData", ({ assert, it, nock, loader }) => {
	it("should get attributes", () => {
		let transaction = new Transaction().configure("id", { key: "value" }, "");
		assert.is(transaction.id(), "id");

		transaction.setAttributes({ identifier: "new" });
		assert.is(transaction.id(), "new");

		transaction = new Transaction().configure("id", { key: "value" }, "", 2);
		assert.instance(transaction, Transaction);

		transaction = new Transaction().configure("id", { key: "value" }, "", "2");
		assert.instance(transaction, Transaction);
	});

	it("should have an id", () => {
		assert.is(new Transaction().configure("id", { key: "value" }, "").id(), "id");
	});

	it("should have a sender", () => {
		assert.is(new Transaction().configure("id", { key: "value" }, "").sender(), "sender");
	});

	it("should have a recipient", () => {
		assert.is(new Transaction().configure("id", { key: "value" }, "").recipient(), "recipient");
	});

	it("should have an amount", () => {
		assert.equal(new Transaction().configure("id", { key: "value" }, "").amount(), BigNumber.ZERO);
	});

	it("should have a fee", () => {
		assert.equal(new Transaction().configure("id", { key: "value" }, "").fee(), BigNumber.ZERO);
	});

	it("should have a timestamp", () => {
		assert.equal(new Transaction().configure("id", { key: "value" }, "").timestamp(), DateTime.make(0));
	});

	it("should get a value", () => {
		assert.is(new Transaction().configure("id", { key: "value" }, "").get("key"), "value");
	});

	it("should transform to JSON", () => {
		assert.string(new Transaction().configure("id", JSON.stringify({ key: "value" }), "").toString());
		assert.string(new Transaction().configure("id", { key: "value" }, "").toString());
	});

	it("should transform to a normalised object", () => {
		assert.object(new Transaction().configure("id", { key: "value" }, "").toObject());
	});
});
