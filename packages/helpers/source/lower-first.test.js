import { describeWithContext } from "@payvo/sdk-test";

import { lowerFirst } from "./lower-first";

describeWithContext(
	"lowerFirst",
	() => ({ dummies: {
		Fred: "fred",
		FRED: "fRED",
		"Test Space": "test Space",
	}}),
	({ assert, it }) => {
		it("should uncapitalize the given input", (context) => {
			Object.keys(context.dummies).forEach((key) => {
				assert.is(lowerFirst(key), context.dummies[key]);
			});
		});
	},
);
