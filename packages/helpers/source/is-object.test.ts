import { isObject } from "./is-object.js";

describe("#isObject", () => {
	it("should pass", () => {
		assert.is(isObject({ key: "value" }), true);
	});

	it("should fail", () => {
		assert.is(isObject(1), false);
	});
});
