import { isNotEqual } from "./is-not-equal";

describe("#isNotEqual", () => {
	it("should pass", () => {
		assert.is(isNotEqual<any>(1, "1"), true);
	});

	it("should fail", () => {
		assert.is(isNotEqual(1, 1), false);
	});
});
