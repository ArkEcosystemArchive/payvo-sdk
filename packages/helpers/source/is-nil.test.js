import { isNil } from "./is-nil";

describe("#isNil", () => {
	it("should pass", () => {
		assert.is(isNil(undefined), true);
		assert.is(isNil(null), true);
	});

	it("should fail", () => {
		assert.is(isNil("undefined"), false);
		assert.is(isNil("null"), false);
	});
});
