import { assert, test } from "@payvo/sdk-test";

import { BigNumber } from "./bignumber";
import { CurrencyFormatter } from "./currency-formatter";

test("#simpleFormatCrypto", () => {
	assert.is(CurrencyFormatter.simpleFormatCrypto(10, "ETH"), "10 ETH");
});

test("#toBuilder", () => {
	assert.instance(CurrencyFormatter.toBuilder(10), BigNumber);
});

test("#subToUnit", () => {
	assert.is(CurrencyFormatter.subToUnit(10e8).toString(), "10");
});

test("#unitToSub", () => {
	assert.is(CurrencyFormatter.unitToSub(10).toString(), "1000000000");
});

test("#cryptoToCurrency with fromSubUnit:true", () => {
	assert.is(CurrencyFormatter.cryptoToCurrency(10e8, 5), "50");
});

test("#cryptoToCurrency with fromSubUnit:false", () => {
	assert.is(CurrencyFormatter.cryptoToCurrency(10, 5, { fromSubUnit: false, decimals: 8 }), "50");
});
