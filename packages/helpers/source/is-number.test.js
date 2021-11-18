import { isNumber } from "./is-number";

describe("#isNumber", () => {
	it("should pass", () => {
		assert.is(isNumber(1), true);
	});

	it("should fail", () => {
		assert.is(isNumber("1"), false);
	});
});
