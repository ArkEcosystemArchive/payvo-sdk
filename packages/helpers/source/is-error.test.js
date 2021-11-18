import { isError } from "./is-error";

describe("#isError", () => {
	test("should pass", () => {
		assert.is(isError(new Error()), true);
	});

	test("should fail", () => {
		assert.is(isError(1), false);
	});
});
