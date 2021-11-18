import { pullAll } from "./pull-all.js";

describe("#pullAll", () => {
	it("should work with a property", () => {
		assert.is(pullAll(["a", "b", "c", "a", "b", "c"], ["a", "c"]), ["b", "b"]);
	});
});
