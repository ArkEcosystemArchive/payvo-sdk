import { assert, test } from "@payvo/sdk-test";

import { merge } from "./merge";

test("should merge the given objects", () => {
	assert.equal(
		merge(
			{
				a: [{ b: 2 }, { d: 4 }],
			},
			{
				a: [{ c: 3 }, { e: 5 }],
			},
		),
		{ a: [{ b: 2 }, { d: 4 }, { c: 3 }, { e: 5 }] },
	);
});

test.run();