import { isAsyncFunction } from "./is-async-function";

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
