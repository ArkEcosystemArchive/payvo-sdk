import { isWeakMap } from "./is-weak-map";

describe("#isWeakMap", () => {
	test("should pass", () => {
		assert.is(isWeakMap(new WeakMap()), true);
	});

	test("should fail", () => {
		assert.is(isWeakMap(1), false);
	});
});
