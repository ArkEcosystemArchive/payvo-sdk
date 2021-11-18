import { isTrue } from "./is-true";

	test("should pass", () => {
		assert.true(isTrue(true));
	});

	test("should fail", () => {
		assert.false(isTrue(false));
	});
