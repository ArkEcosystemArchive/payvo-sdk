import { isObject } from "./is-object";

describe("#isObject", () => {
	it("should pass", () => {
		assert.is(isObject({ key: "value" }), true);
	});

	it("should fail", () => {
		assert.is(isObject(1), false);
	});
});
