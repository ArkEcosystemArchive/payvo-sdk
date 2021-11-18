import { isFalse } from "./is-false.js";

describe("#isFalse", () => {
	it("should pass", () => {
		assert.is(isFalse(false), true);
	});

	it("should fail", () => {
		assert.is(isFalse(true), false);
	});
});
