import { isError } from "./is-error";

	test("should pass", () => {
		assert.true(isError(new Error()));
	});

	test("should fail", () => {
		assert.false(isError(1));
	});
