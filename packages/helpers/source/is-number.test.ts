import { isNumber } from "./is-number.js";

describe("#isNumber", () => {
	it("should pass", () => {
		assert.is(isNumber(1), true);
	});

	it("should fail", () => {
		assert.is(isNumber("1"), false);
	});
});
