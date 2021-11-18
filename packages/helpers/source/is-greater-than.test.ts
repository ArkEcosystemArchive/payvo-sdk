import { isGreaterThan } from "./is-greater-than.js";

describe("#isGreaterThan", () => {
	it("should pass", () => {
		assert.is(isGreaterThan(2, 1), true);
	});

	it("should fail", () => {
		assert.is(isGreaterThan(1, 2), false);
	});
});
