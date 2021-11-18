import { reject } from "./reject";

test("#reject", () => {
	const users = [
		{ user: "barney", age: 36, active: false },
		{ user: "fred", age: 40, active: true },
	];

	test("should work with a function", () => {
		assert.is(
			reject(users, (o) => !o.active),
			[{ user: "fred", age: 40, active: true }],
		);
	});
});
