import { assert, test } from "@payvo/sdk-test";

import { isObject } from "./is-object";

test("should pass", () => {
	assert.true(isObject({ key: "value" }));
});

test("should fail", () => {
	assert.false(isObject(1));
});

test.run();
