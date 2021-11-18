import { isAsyncFunction } from "./is-async-function.js";

describe("#isAsyncFunction", () => {
	it("should pass", () => {
		assert.is(
			isAsyncFunction(async () => ({})),
			true,
		);
	});

	it("should fail", () => {
		assert.is(isAsyncFunction(new Function()), false);
		assert.is(isAsyncFunction([]), false);
	});
});
