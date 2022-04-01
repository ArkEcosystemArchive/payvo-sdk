/* eslint-disable */

import { describe } from "@payvo/sdk-test";

import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";
import { AbstractSignedTransactionData } from "./signed-transaction.dto.js";

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

describe("AbstractSignedTransactionData", ({ assert, beforeEach, it }) => {
	beforeEach((context) => {
		// @ts-ignore - we don't need any bindings in this test
		context.subject = new Transaction({ get() {} });
	});

	it("should get attributes", (context) => {
		let transaction = context.subject.configure("id", { key: "value" }, "");
		assert.is(transaction.id(), "id");

		transaction.setAttributes({ identifier: "new" });
		assert.is(transaction.id(), "new");

		transaction = context.subject.configure("id", { key: "value" }, "", 2);
		assert.instance(transaction, Transaction);

		transaction = context.subject.configure("id", { key: "value" }, "", "2");
		assert.instance(transaction, Transaction);
	});

	it("should have an id", (context) => {
		assert.is(context.subject.configure("id", { key: "value" }, "").id(), "id");
	});

	it("should have a sender", (context) => {
		assert.is(context.subject.configure("id", { key: "value" }, "").sender(), "sender");
	});

	it("should have a recipient", (context) => {
		assert.is(context.subject.configure("id", { key: "value" }, "").recipient(), "recipient");
	});

	it("should have an amount", (context) => {
		assert.equal(context.subject.configure("id", { key: "value" }, "").amount(), BigNumber.ZERO);
	});

	it("should have a fee", (context) => {
		assert.equal(context.subject.configure("id", { key: "value" }, "").fee(), BigNumber.ZERO);
	});

	it("should have a timestamp", (context) => {
		assert.equal(context.subject.configure("id", { key: "value" }, "").timestamp(), DateTime.make(0));
	});

	it("should get a value", (context) => {
		assert.is(context.subject.configure("id", { key: "value" }, "").get("key"), "value");
	});

	it("should transform to JSON", (context) => {
		assert.string(context.subject.configure("id", JSON.stringify({ key: "value" }), "").toString());
		assert.string(context.subject.configure("id", { key: "value" }, "").toString());
	});

	it("should transform to a normalised object", (context) => {
		assert.object(context.subject.configure("id", { key: "value" }, "").toObject());
	});

	it("should normalize broadcast data", (context) => {
		assert.object(
			context.subject
				.configure(
					"id",
					{
						key: "value",
					},
					{
						key: "value",
						amount: BigNumber.make(0),
						fee: BigNumber.make(10),
						timestamp: DateTime.make(),
						bigint: BigNumber.make(10).toBigInt(),
						map: new Map([[1, "one"]]),
					},
				)
				.toSignedData(),
		);
	});
	it("should normalize signed data", (context) => {
		assert.object(
			context.subject
				.configure(
					"id",
					{
						key: "value",
						amount: BigNumber.make(0),
						fee: BigNumber.make(10),
						timestamp: DateTime.make(),
						bigint: BigNumber.make(10).toBigInt(),
						map: new Map([[1, "one"]]),
					},
					"",
				)
				.toSignedData(),
		);
	});
});
