import { isSet } from "./is-set";

	test("should pass", () => {
		assert.true(isSet(new Set()));
	});

	test("should fail", () => {
		assert.false(isSet(1));
	});
