import { test } from "uvu";
import * as assert from "uvu/assert";

import { Currency } from "./currency";

test("#fromString", () => {
	assert.equal(Currency.fromString(""), { display: "", value: undefined });

	assert.equal(Currency.fromString("0"), { display: "0", value: "0" });

	assert.equal(Currency.fromString("Ѧ 0,0001"), { display: "0.0001", value: "10000" });

	assert.equal(Currency.fromString("R$ 45,210.21"), { display: "45.21021", value: "4521021000" });

	assert.equal(Currency.fromString("$ 45.210,21"), { display: "45.21021", value: "4521021000" });

	assert.equal(Currency.fromString("Ѧ 0.1000000081283"), { display: "0.10000000", value: "10000000" });

	assert.equal(Currency.fromString("52,21579"), { display: "52.21579", value: "5221579000" });
});

test.run();
