import { isArrayOfType } from "./is-array-of-type.js";

describe("#isArrayOfType", () => {
	it("should pass", () => {
		assert.is(isArrayOfType<number>([1], "number"), true);
	});

	it("should fail", () => {
		assert.is(isArrayOfType<number>(["string"], "number"), false);
	});
});
