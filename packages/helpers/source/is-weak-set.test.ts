import { isWeakSet } from "./is-weak-set.js";

describe("#isWeakSet", () => {
	it("should pass", () => {
		expect(isWeakSet(new WeakSet())).toBeTrue();
	});

	it("should fail", () => {
		expect(isWeakSet(1)).toBeFalse();
	});
});
