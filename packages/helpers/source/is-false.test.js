import { isFalse } from "./is-false";

describe("#isFalse", () => {
	test("should pass", () => {
		assert.is(isFalse(false), true);
	});

	test("should fail", () => {
		assert.is(isFalse(true), false);
	});
});
