import { describe } from "@payvo/sdk-test";

import { reject } from "./reject";

const users = [
	{ user: "barney", age: 36, active: false },
	{ user: "fred", age: 40, active: true },
];

describe("reject", async ({ assert, it }) => {
	it("should work with a function", () => {
		assert.equal(
			reject(users, (o) => !o.active),
			[{ user: "fred", age: 40, active: true }],
		);
	});
});
