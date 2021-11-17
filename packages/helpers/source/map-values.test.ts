import "jest-extended";

import { mapValues } from "./map-values.js";

describe("#mapValues", () => {
	const users = {
		fred: { user: "fred", age: 40 },
		pebbles: { user: "pebbles", age: 1 },
	};

	it("should work with a function", () => {
		expect(mapValues(users, (o) => o.age)).toEqual({ fred: 40, pebbles: 1 });
	});
});
