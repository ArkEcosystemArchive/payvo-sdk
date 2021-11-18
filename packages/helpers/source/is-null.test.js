import { isNull } from "./is-null";

describe("#isNull", () => {
	test("should pass", () => {
		assert.is(isNull(null), true);
	});

	test("should fail", () => {
		assert.is(isNull("null"), false);
	});
});
