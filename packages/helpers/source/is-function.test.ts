import { isFunction } from "./is-function.js";

describe("#isFunction", () => {
	it("should pass", () => {
		assert.is(isFunction(new Function()), true);
		assert.is(
			isFunction(async () => ({})),
			true,
		);
	});

	it("should fail", () => {
		assert.is(isFunction([]), false);
	});
});
