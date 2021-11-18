import { isBoolean } from "./is-boolean";

test("#isBoolean", () => {
	test("should pass", () => {
		assert.is(isBoolean(true), true);
	});

	test("should fail", () => {
		assert.is(isBoolean("false"), false);
	});
});
