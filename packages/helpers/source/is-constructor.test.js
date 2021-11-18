import { assert, test } from "@payvo/sdk-test";

import { isConstructor } from "./is-constructor";

test("should pass", () => {
	assert.true(isConstructor(Date));
});

test("should fail", () => {
	assert.false(isConstructor([]));
});

test.run();
