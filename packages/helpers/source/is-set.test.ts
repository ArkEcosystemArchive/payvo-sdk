import { isSet } from "./is-set.js";

describe("#isSet", () => {
	it("should pass", () => {
		assert.is(isSet(new Set()), true);
	});

	it("should fail", () => {
		assert.is(isSet(1), false);
	});
});
