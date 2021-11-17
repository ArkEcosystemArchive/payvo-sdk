import { isMap } from "./is-map.js";

describe("#isMap", () => {
	it("should pass", () => {
		expect(isMap(new Map())).toBeTrue();
	});

	it("should fail", () => {
		expect(isMap(1)).toBeFalse();
	});
});
