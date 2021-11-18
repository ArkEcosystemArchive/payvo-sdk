import { isWeakMap } from "./is-weak-map";

describe("#isWeakMap", () => {
	it("should pass", () => {
		assert.is(isWeakMap(new WeakMap()), true);
	});

	it("should fail", () => {
		assert.is(isWeakMap(1), false);
	});
});
