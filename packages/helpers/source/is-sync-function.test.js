import { isSyncFunction } from "./is-sync-function";

	test("should pass", () => {
		assert.true(isSyncFunction(new Function()));
	});

	test("should fail", () => {
		assert.false(isSyncFunction(async () => ({})));
		assert.false(isSyncFunction([]));
	});
