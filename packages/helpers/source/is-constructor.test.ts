import { isConstructor } from "./is-constructor.js";

describe("#isConstructor", () => {
	it("should pass", () => {
		expect(isConstructor(Date)).toBeTrue();
	});

	it("should fail", () => {
		expect(isConstructor([])).toBeFalse();
	});
});
