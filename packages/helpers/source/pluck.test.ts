import { pluck } from "./pluck.js";

describe("#pluck", () => {
	it("should return the names of the users", () => {
		assert
			.is(
				pluck(
					[
						{ user: "barney", age: 36 },
						{ user: "fred", age: 40 },
					],
					"user",
				),
			)
			.toEqual(["barney", "fred"]);
		assert.is(pluck([{ age: 36 }, { age: 40 }], "user"), []);
	});
});
