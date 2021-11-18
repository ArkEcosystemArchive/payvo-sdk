import { isAsyncFunction } from "./is-async-function";

describe("#isAsyncFunction", () => {
	test("should pass", () => {
		assert.is(
			isAsyncFunction(async () => ({})),
			true,
		);
	});

	test("should fail", () => {
		assert.is(isAsyncFunction(new Function()), false);
		assert.is(isAsyncFunction([]), false);
	});
});
