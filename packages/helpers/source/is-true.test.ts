import { isTrue } from "./is-true.js";

describe("#isTrue", () => {
	it("should pass", () => {
		expect(isTrue(true)).toBeTrue();
	});

	it("should fail", () => {
		expect(isTrue(false)).toBeFalse();
	});
});
