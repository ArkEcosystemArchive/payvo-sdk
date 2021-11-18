import { isSyncFunction } from "./is-sync-function";

describe("#isSyncFunction", () => {
	test("should pass", () => {
		assert.is(isSyncFunction(new Function()), true);
	});

	test("should fail", () => {
		assert.is(
			isSyncFunction(async () => ({})),
			false,
		);
		assert.is(isSyncFunction([]), false);
	});
});
