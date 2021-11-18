import { isPromise } from "./is-promise.js";

describe("#isPromise", () => {
	it("should pass", () => {
		assert.is(isPromise(new Promise(() => {})), true);
	});

	it("should fail", () => {
		assert.is(isPromise(1), false);
	});
});
