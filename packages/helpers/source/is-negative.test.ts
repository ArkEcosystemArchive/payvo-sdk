import { isNegative } from "./is-negative.js";

describe("#isNegative", () => {
	it("should pass", () => {
		expect(isNegative(-1)).toBeTrue();
	});

	it("should fail", () => {
		expect(isNegative(1)).toBeFalse();
	});
});
