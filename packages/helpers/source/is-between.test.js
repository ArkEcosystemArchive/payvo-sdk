import { isBetween } from "./is-between";

describe("#isBetween", () => {
	it("should pass", () => {
		assert.is(isBetween(2, 1, 3), true);
	});

	it("should fail", () => {
		assert.is(isBetween(1, 2, 3), false);
	});
});
