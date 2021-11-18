import { pull } from "./pull";

describe("#pull", () => {
	test("should work with a property", () => {
		assert.is(pull(["a", "b", "c", "a", "b", "c"], "a", "c"), ["b", "b"]);
	});
});
