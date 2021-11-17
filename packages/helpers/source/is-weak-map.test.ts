import { isWeakMap } from "./is-weak-map.js";

describe("#isWeakMap", () => {
	it("should pass", () => {
		expect(isWeakMap(new WeakMap())).toBeTrue();
	});

	it("should fail", () => {
		expect(isWeakMap(1)).toBeFalse();
	});
});
