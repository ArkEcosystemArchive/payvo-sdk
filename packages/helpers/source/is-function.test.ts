import { isFunction } from "./is-function.js";

describe("#isFunction", () => {
	it("should pass", () => {
		expect(isFunction(new Function())).toBeTrue();
		expect(isFunction(async () => ({}))).toBeTrue();
	});

	it("should fail", () => {
		expect(isFunction([])).toBeFalse();
	});
});
