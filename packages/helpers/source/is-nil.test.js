import { isNil } from "./is-nil";

describe("#isNil", () => {
	test("should pass", () => {
		assert.is(isNil(undefined), true);
		assert.is(isNil(null), true);
	});

	test("should fail", () => {
		assert.is(isNil("undefined"), false);
		assert.is(isNil("null"), false);
	});
});
