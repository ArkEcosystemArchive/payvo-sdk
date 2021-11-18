import { isWeakSet } from "./is-weak-set";

describe("#isWeakSet", () => {
	it("should pass", () => {
		assert.is(isWeakSet(new WeakSet()), true);
	});

	it("should fail", () => {
		assert.is(isWeakSet(1), false);
	});
});
