import { assert, test } from "@payvo/sdk-test";

import { isPromise } from "./is-promise";

test("should pass", () => {
	assert.true(isPromise(new Promise(() => {})));
});

test("should fail", () => {
	assert.false(isPromise(1));
});

test.run();
