import { isError } from "./is-error.js";

describe("#isError", () => {
	it("should pass", () => {
		assert.is(isError(new Error()), true);
	});

	it("should fail", () => {
		assert.is(isError(1), false);
	});
});
