import { isNotEqual } from "./is-not-equal";

describe("#isNotEqual", () => {
	test("should pass", () => {
		assert.is(isNotEqual<any>(1, "1"), true);
	});

	test("should fail", () => {
		assert.is(isNotEqual(1, 1), false);
	});
});
