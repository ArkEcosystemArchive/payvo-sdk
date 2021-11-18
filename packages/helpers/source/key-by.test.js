import { assert, test } from "@payvo/sdk-test";

import { keyBy } from "./key-by";

const array = [
	{ dir: "left", code: 97 },
	{ dir: "right", code: 100 },
];

test("should work with a function", () => {
	assert.equal(
		keyBy(array, (o) => String.fromCharCode(o.code)),
		{
			a: { dir: "left", code: 97 },
			d: { dir: "right", code: 100 },
		},
	);
});

test.run();
