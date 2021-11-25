import { describe } from "@payvo/sdk-test";
import "reflect-metadata";

import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";

import { UnspentTransactionData } from "./unspent-transaction.dto";

describe("UnspentTransactionData", ({ assert, it }) => {
	it("should have an id", () => {
		assert.string(new UnspentTransactionData({ id: "value" }).id());
	});

	it("should have a timestamp", () => {
		assert.instance(new UnspentTransactionData({ timestamp: DateTime.make() }).timestamp(), DateTime);
	});

	it("should have an amount", () => {
		assert.instance(new UnspentTransactionData({ amount: BigNumber.make(1) }).amount(), BigNumber);
	});

	it("should have addresses", () => {
		assert.is(new UnspentTransactionData({ address: "a" }).address(), "a");
	});
});
