import "jest-extended";
import "reflect-metadata";

import { BigNumber } from "@payvo/helpers";
import { DateTime } from "@payvo/intl";

import { UnspentTransactionData } from "./unspent-transaction";

test("#id", () => {
	expect(new UnspentTransactionData({ id: "value" }).id()).toBeString();
});

test("#timestamp", () => {
	expect(new UnspentTransactionData({ timestamp: DateTime.make() }).timestamp()).toBeInstanceOf(DateTime);
});

test("#amount", () => {
	expect(new UnspentTransactionData({ amount: BigNumber.make(1) }).amount()).toBeInstanceOf(BigNumber);
});

test("#addresses", () => {
	expect(new UnspentTransactionData({ addresses: ["a", "b", "c"] }).addresses()).toBeArray();
});
