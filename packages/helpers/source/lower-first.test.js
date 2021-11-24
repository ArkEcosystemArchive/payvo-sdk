import { describe } from "@payvo/sdk-test";

import { lowerFirst } from "./lower-first";

const dummies = {
	Fred: "fred",
	FRED: "fRED",
	"Test Space": "test Space",
};

describe("lowerFirst", async ({ assert, it }) => {
	it("should uncapitalize the given input", () => {
		Object.keys(dummies).forEach((key) => {
			assert.is(lowerFirst(key), dummies[key]);
		});
	});
});
