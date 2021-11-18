import { assert, test } from "@payvo/sdk-test";

import { upperFirst } from "./upper-first";

const dummies = {
	fred: "Fred",
	FRED: "FRED",
	"test space": "Test space",
};

test("should capitalize the given input", () => {
	Object.keys(dummies).forEach((key) => {
		assert.is(upperFirst(key), dummies[key]);
	});
});

test.run();
