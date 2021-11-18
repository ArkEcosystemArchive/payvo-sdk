import { pull } from "./pull.js";

describe("#pull", () => {
	it("should work with a property", () => {
		assert.is(pull(["a", "b", "c", "a", "b", "c"], "a", "c"), ["b", "b"]);
	});
});
