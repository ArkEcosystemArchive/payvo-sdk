import { describe } from "@payvo/sdk-test";

import { keyBy } from "./key-by";

describe("keyBy", async ({ assert, it }) => {
	it("should work with a function", () => {
		const array = [
			{ dir: "left", code: 97 },
			{ dir: "right", code: 100 },
		];

		assert.equal(
			keyBy(array, (o) => String.fromCharCode(o.code)),
			{
				a: { dir: "left", code: 97 },
				d: { dir: "right", code: 100 },
			},
		);
	});
});
