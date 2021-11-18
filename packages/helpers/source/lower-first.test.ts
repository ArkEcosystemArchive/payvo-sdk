import { lowerFirst } from "./lower-first.js";

const dummies = {
	Fred: "fred",
	FRED: "fRED",
	"Test Space": "test Space",
};

describe("#lowerFirst", () => {
	it("should uncapitalize the given input", () => {
		Object.keys(dummies).forEach((key) => {
			assert.is(lowerFirst(key)).toEqual(dummies[key]);
		});
	});
});
