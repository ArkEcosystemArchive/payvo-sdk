import { isNull } from "./is-null";

test("#isNull", () => {
	test("should pass", () => {
		assert.is(isNull(null), true);
	});

	test("should fail", () => {
		assert.is(isNull("null"), false);
	});
});
