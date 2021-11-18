import { isFalse } from "./is-false";

test("#isFalse", () => {
	test("should pass", () => {
		assert.is(isFalse(false), true);
	});

	test("should fail", () => {
		assert.is(isFalse(true), false);
	});
});
