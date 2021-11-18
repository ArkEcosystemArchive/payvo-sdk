import { isUndefined } from "./is-undefined";

	test("should pass", () => {
		assert.true(isUndefined(undefined));
	});

	test("should fail", () => {
		assert.false(isUndefined("undefined"));
	});
