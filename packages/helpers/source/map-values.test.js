import { mapValues } from "./map-values";

test("#mapValues", () => {
	const users = {
		fred: { user: "fred", age: 40 },
		pebbles: { user: "pebbles", age: 1 },
	};

	test("should work with a function", () => {
		assert.is(
			mapValues(users, (o) => o.age),
			{ fred: 40, pebbles: 1 },
		);
	});
});
