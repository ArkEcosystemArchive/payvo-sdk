import { assert, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";

import { UnspentTransactionData } from "./unspent-transaction";

test("#id", () => {
	assert.string(new UnspentTransactionData({ id: "value" }).id());
});

test("#timestamp", () => {
	assert.instance(new UnspentTransactionData({ timestamp: DateTime.make() }).timestamp(), DateTime);
});

test("#amount", () => {
	assert.instance(new UnspentTransactionData({ amount: BigNumber.make(1) }).amount(), BigNumber);
});

test("#addresses", () => {
	assert.is(new UnspentTransactionData({ address: "a" }).address(), "a");
});

test.run();
