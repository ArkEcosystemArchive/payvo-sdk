import { isPromise } from "./is-promise";

describe("#isPromise", () => {
	test("should pass", () => {
		assert.is(isPromise(new Promise(() => {})), true);
	});

	test("should fail", () => {
		assert.is(isPromise(1), false);
	});
});
