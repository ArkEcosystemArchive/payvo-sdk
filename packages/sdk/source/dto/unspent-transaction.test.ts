import "jest-extended";
import "reflect-metadata";

import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";

import { UnspentTransactionData } from "./unspent-transaction.js";

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
    expect(new UnspentTransactionData({ address: "a" }).address()).toBe("a");
});
