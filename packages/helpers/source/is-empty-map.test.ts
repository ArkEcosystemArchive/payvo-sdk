import "jest-extended";

import { isEmptyMap } from "./is-empty-map.js";

describe("#isEmptyMap", () => {
	it("should return true for an empty map", () => {
		expect(isEmptyMap(new Map())).toBeTrue();
	});
});
