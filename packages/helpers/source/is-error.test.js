import { isError } from "./is-error";

describe("#isError", () => {
	it("should pass", () => {
		assert.is(isError(new Error()), true);
	});

	it("should fail", () => {
		assert.is(isError(1), false);
	});
});
