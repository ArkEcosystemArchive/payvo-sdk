import { isUndefined } from "./is-undefined";

describe("#isUndefined", () => {
	it("should pass", () => {
		assert.is(isUndefined(undefined), true);
	});

	it("should fail", () => {
		assert.is(isUndefined("undefined"), false);
	});
});
