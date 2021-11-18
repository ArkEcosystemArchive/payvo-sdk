import { pullAll } from "./pull-all";

describe("#pullAll", () => {
	test("should work with a property", () => {
		assert.is(pullAll(["a", "b", "c", "a", "b", "c"], ["a", "c"]), ["b", "b"]);
	});
});
