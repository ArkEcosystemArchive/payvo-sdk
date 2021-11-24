import { describe } from "@payvo/sdk-test";

import { mapValues } from "./map-values";

const users = {
	fred: { user: "fred", age: 40 },
	pebbles: { user: "pebbles", age: 1 },
};

describe("mapValues", async ({ assert, it }) => {
	it("should work with a function", () => {
		assert.equal(
			mapValues(users, (o) => o.age),
			{ fred: 40, pebbles: 1 },
		);
	});
});
