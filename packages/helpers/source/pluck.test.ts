import { pluck } from "./pluck.js";

describe("#pluck", () => {
	it("should return the names of the users", () => {
		expect(
			pluck(
				[
					{ user: "barney", age: 36 },
					{ user: "fred", age: 40 },
				],
				"user",
			),
		).toEqual(["barney", "fred"]);
		expect(pluck([{ age: 36 }, { age: 40 }], "user")).toEqual([]);
	});
});
