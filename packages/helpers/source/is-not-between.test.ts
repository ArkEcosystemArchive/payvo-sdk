import { isNotBetween } from "./is-not-between.js";

describe("#isNotBetween", () => {
	it("should pass", () => {
		assert.is(isNotBetween(1, 2, 3), true);
	});

	it("should fail", () => {
		assert.is(isNotBetween(2, 1, 3), false);
	});
});
