import { isNumber } from "./is-number";
import { omitBy } from "./omit-by";

describe("#omitBy", () => {
	test("should work with a function", () => {
		assert.is(omitBy({ a: 1, b: "2", c: 3 }, isNumber), { b: "2" });
	});
});
