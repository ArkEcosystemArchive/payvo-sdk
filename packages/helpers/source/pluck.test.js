import { assert, test } from "@payvo/sdk-test";

import { pluck } from "./pluck";

	test("should return the names of the users", () => {
		assert
			.equal(
				pluck(
					[
						{ user: "barney", age: 36 },
						{ user: "fred", age: 40 },
					],
					"user",
				), ["barney", "fred"]);
		assert.equal(pluck([{ age: 36 }, { age: 40 }], "user"), []);
	});
