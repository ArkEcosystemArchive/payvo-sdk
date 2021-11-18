import { isSyncFunction } from "./is-sync-function.js";

describe("#isSyncFunction", () => {
	it("should pass", () => {
		assert.is(isSyncFunction(new Function()), true);
	});

	it("should fail", () => {
		assert.is(
			isSyncFunction(async () => ({})),
			false,
		);
		assert.is(isSyncFunction([]), false);
	});
});
