import { reject } from "./reject.js";

describe("#reject", () => {
	const users = [
		{ user: "barney", age: 36, active: false },
		{ user: "fred", age: 40, active: true },
	];

	it("should work with a function", () => {
		assert.is(reject(users, (o) => !o.active)).toEqual([{ user: "fred", age: 40, active: true }]);
	});
});
