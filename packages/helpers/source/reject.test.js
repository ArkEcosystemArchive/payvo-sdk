import { assert, test } from "@payvo/sdk-test";

import { reject } from "./reject";

	const users = [
		{ user: "barney", age: 36, active: false },
		{ user: "fred", age: 40, active: true },
	];

	test("should work with a function", () => {
		assert.equal(
			reject(users, (o) => !o.active),
			[{ user: "fred", age: 40, active: true }],
		);
	});
