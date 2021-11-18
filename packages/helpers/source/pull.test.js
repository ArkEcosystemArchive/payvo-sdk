import { pull } from "./pull";

	test("should work with a property", () => {
		assert.equal(pull(["a", "b", "c", "a", "b", "c"], "a", "c"), ["b", "b"]);
	});
