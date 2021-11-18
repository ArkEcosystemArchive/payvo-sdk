import { isBoolean } from "./is-boolean.js";

describe("#isBoolean", () => {
	it("should pass", () => {
		assert.is(isBoolean(true), true);
	});

	it("should fail", () => {
		assert.is(isBoolean("false"), false);
	});
});
