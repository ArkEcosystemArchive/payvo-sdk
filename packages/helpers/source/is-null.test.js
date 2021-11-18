import { isNull } from "./is-null";

	test("should pass", () => {
		assert.true(isNull(null));
	});

	test("should fail", () => {
		assert.false(isNull("null"));
	});
