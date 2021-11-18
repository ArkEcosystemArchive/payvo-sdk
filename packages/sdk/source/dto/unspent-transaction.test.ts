import "reflect-metadata";

import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";

import { UnspentTransactionData } from "./unspent-transaction.js";

test("#id", () => {
    assert.is(new UnspentTransactionData({ id: "value" }).id()), "string");
});

test("#timestamp", () => {
    assert.is(new UnspentTransactionData({ timestamp: DateTime.make() }).timestamp() instanceof DateTime);
});

test("#amount", () => {
    assert.is(new UnspentTransactionData({ amount: BigNumber.make(1) }).amount() instanceof BigNumber);
});

test("#addresses", () => {
    assert.is(new UnspentTransactionData({ address: "a" }).address(), "a");
});
