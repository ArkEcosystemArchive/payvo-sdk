import { describe } from "@payvo/sdk-test";

import { find } from "./find";

describe("find", async ({ assert, it, nock, loader }) => {
	it("should work with a function", () => {
		const users = [
			{ user: "barney", age: 36, active: true },
			{ user: "fred", age: 40, active: false },
			{ user: "pebbles", age: 1, active: true },
		];

		assert.is(
			find(users, (o) => o.age < 40),
			users[0],
		);

		assert.undefined(find(users, (o) => o.name === "john"));
	});
});
