import { isWeakSet } from "./is-weak-set";

describe("#isWeakSet", () => {
	test("should pass", () => {
		assert.is(isWeakSet(new WeakSet()), true);
	});

	test("should fail", () => {
		assert.is(isWeakSet(1), false);
	});
});
