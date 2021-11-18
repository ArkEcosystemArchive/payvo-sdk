import { isString } from "./is-string";

	test("should pass", () => {
		assert.true(isString("string"));
	});

	test("should fail", () => {
		assert.false(isString(1));
	});
