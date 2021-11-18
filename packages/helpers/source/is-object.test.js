import { isObject } from "./is-object";

describe("#isObject", () => {
	test("should pass", () => {
		assert.is(isObject({ key: "value" }), true);
	});

	test("should fail", () => {
		assert.is(isObject(1), false);
	});
});
