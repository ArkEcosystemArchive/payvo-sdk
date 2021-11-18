import { isUndefined } from "./is-undefined";

test("#isUndefined", () => {
	test("should pass", () => {
		assert.is(isUndefined(undefined), true);
	});

	test("should fail", () => {
		assert.is(isUndefined("undefined"), false);
	});
});
