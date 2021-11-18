import { isNull } from "./is-null.js";

describe("#isNull", () => {
	it("should pass", () => {
		assert.is(isNull(null), true);
	});

	it("should fail", () => {
		assert.is(isNull("null"), false);
	});
});
