import { assert, test } from "@payvo/sdk-test";

import { isDate } from "./is-date";

test("should pass", () => {
	assert.true(isDate(new Date()));
});

test("should fail", () => {
	assert.false(isDate(1));
});

test.run();
