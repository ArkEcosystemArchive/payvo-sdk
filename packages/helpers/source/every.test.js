import { assert, test } from "@payvo/sdk-test";

import { every } from "./every";
import { isBoolean } from "./is-boolean";

test("should work with a functions", () => {
	assert.true(every([true, false], isBoolean));
	assert.false(every([true, false, "yes"], isBoolean));
});

test.run();
