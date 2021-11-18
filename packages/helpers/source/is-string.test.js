import { isString } from "./is-string";

describe("#isString", () => {
	test("should pass", () => {
		assert.is(isString("string"), true);
	});

	test("should fail", () => {
		assert.is(isString(1), false);
	});
});
