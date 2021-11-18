import { isFunction } from "./is-function";

test("#isFunction", () => {
	test("should pass", () => {
		assert.is(isFunction(new Function()), true);
		assert.is(
			isFunction(async () => ({})),
			true,
		);
	});

	test("should fail", () => {
		assert.is(isFunction([]), false);
	});
});
