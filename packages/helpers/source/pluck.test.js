import { pluck } from "./pluck";

test("#pluck", () => {
	test("should return the names of the users", () => {
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
