/* eslint-disable */

import "reflect-metadata";

import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { AbstractSignedTransactionData } from "./signed-transaction";

test("#setAttributes", () => {
	let transaction = new Transaction().configure("id", { key: "value" }, "");
	assert.is(transaction.id(), "id");

	transaction.setAttributes({ identifier: "new" });
	assert.is(transaction.id(), "new");

	transaction = new Transaction().configure("id", { key: "value" }, "", 2);
	assert.is(transaction instanceof Transaction);

	transaction = new Transaction().configure("id", { key: "value" }, "", "2");
	assert.is(transaction instanceof Transaction);
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
	assert.is(new Transaction().configure("id", { key: "value" }, "").amount(), BigNumber.ZERO);
});

test("#fee", () => {
	assert.is(new Transaction().configure("id", { key: "value" }, "").fee(), BigNumber.ZERO);
});

test("#timestamp", () => {
	assert.is(new Transaction().configure("id", { key: "value" }, "").timestamp(), DateTime.make(0));
});

test("#get", () => {
	assert.is(new Transaction().configure("id", { key: "value" }, "").get("key"), "value");
});

test("#toString", () => {
	assert
		.is(new Transaction().configure("id", JSON.stringify({ key: "value" }), "").toString())
		.toMatchInlineSnapshot(`"{\\"key\\":\\"value\\"}"`);
	assert
		.is(new Transaction().configure("id", { key: "value" }, "").toString())
		.toMatchInlineSnapshot(`"{\\"key\\":\\"value\\"}"`);
});

test("#toObject", () => {
	assert.is(new Transaction().configure("id", { key: "value" }, "").toObject()).toMatchInlineSnapshot(`
		Object {
		  "amount": "0",
		  "broadcast": "",
		  "data": Object {
		    "key": "value",
		  },
		  "fee": "0",
		  "id": "id",
		  "recipient": "recipient",
		  "sender": "sender",
		  "timestamp": "1970-01-01T00:00:00.000Z",
		}
	`);
});

class Transaction extends AbstractSignedTransactionData {
	// @ts-ignore
	public sender(): string {
		return "sender";
	}

	// @ts-ignore
	public recipient(): string {
		return "recipient";
	}

	// @ts-ignore
	public amount(): BigNumber {
		return BigNumber.ZERO;
	}

	// @ts-ignore
	public fee(): BigNumber {
		return BigNumber.ZERO;
	}

	// @ts-ignore
	public timestamp(): DateTime {
		return DateTime.make(0);
	}
}
