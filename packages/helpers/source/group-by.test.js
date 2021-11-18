import { assert, test } from "@payvo/sdk-test";

import { groupBy } from "./group-by";

test("should work with a function", () => {
	assert.equal(
		groupBy(
			[
				{ first: "John", last: "Doe" },
				{ first: "Jane", last: "Doe" },
				{ first: "John", last: "Dorian" },
			],
			(o) => o.last,
		),
		{
			Doe: [
				{ first: "John", last: "Doe" },
				{ first: "Jane", last: "Doe" },
			],
			Dorian: [{ first: "John", last: "Dorian" }],
		},
	);
});

test("should with a native function", () => {
	assert.equal(groupBy([6.1, 4.2, 6.3], Math.floor), { 4: [4.2], 6: [6.1, 6.3] });
});

test.run();
