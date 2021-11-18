import { isTrue } from "./is-true";

test("#isTrue", () => {
	test("should pass", () => {
		assert.is(isTrue(true), true);
	});

	test("should fail", () => {
		assert.is(isTrue(false), false);
	});
});
