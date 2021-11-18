import { assert, test } from "@payvo/sdk-test";

import { numberToHex } from "./number-to-hex";

test("should return the number as hex", () => {
	assert.is(numberToHex(1), "01");
});

test.run();
