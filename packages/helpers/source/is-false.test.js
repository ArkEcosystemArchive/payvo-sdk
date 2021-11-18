import { isFalse } from "./is-false";

describe("#isFalse", () => {
	it("should pass", () => {
		assert.is(isFalse(false), true);
	});

	it("should fail", () => {
		assert.is(isFalse(true), false);
	});
});
