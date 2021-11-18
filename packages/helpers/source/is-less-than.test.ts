import { isLessThan } from "./is-less-than.js";

describe("#isLessThan", () => {
	it("should pass", () => {
		assert.is(isLessThan(5, 10), true);
	});

	it("should fail", () => {
		assert.is(isLessThan(10, 5), false);
	});
});
