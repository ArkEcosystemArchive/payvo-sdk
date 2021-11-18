import { isSet } from "./is-set";

test("#isSet", () => {
	test("should pass", () => {
		assert.is(isSet(new Set()), true);
	});

	test("should fail", () => {
		assert.is(isSet(1), false);
	});
