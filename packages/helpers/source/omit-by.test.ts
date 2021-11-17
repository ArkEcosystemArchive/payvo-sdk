import "jest-extended";

import { isNumber } from "./is-number.js";
import { omitBy } from "./omit-by.js";

describe("#omitBy", () => {
	it("should work with a function", () => {
		expect(omitBy({ a: 1, b: "2", c: 3 }, isNumber)).toEqual({ b: "2" });
	});
});
