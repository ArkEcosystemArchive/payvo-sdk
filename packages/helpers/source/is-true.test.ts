import { isTrue } from "./is-true.js";

describe("#isTrue", () => {
	it("should pass", () => {
		assert.is(isTrue(true), true);
	});

	it("should fail", () => {
		assert.is(isTrue(false), false);
	});
});
