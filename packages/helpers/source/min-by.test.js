import { assert, test } from "@payvo/sdk-test";

import { minBy } from "./min-by";

test("should work with a function", () => {
	assert.equal(
		minBy([{ n: 2 }, { n: 3 }, { n: 1 }, { n: 5 }, { n: 4 }], (o) => o.n),
		{ n: 1 },
	);
});

test.run();
