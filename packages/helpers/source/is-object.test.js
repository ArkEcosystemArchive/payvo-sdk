import { isObject } from "./is-object";

	test("should pass", () => {
		assert.true(isObject({ key: "value" }));
	});

	test("should fail", () => {
		assert.false(isObject(1));
	});
