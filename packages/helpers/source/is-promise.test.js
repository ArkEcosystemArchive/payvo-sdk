import { isPromise } from "./is-promise";

test("#isPromise", () => {
	test("should pass", () => {
		assert.is(isPromise(new Promise(() => {})), true);
	});

	test("should fail", () => {
		assert.is(isPromise(1), false);
	});
});
