import { assert, test } from "@payvo/sdk-test";

import { pullAll } from "./pull-all";

	test("should work with a property", () => {
		assert.equal(pullAll(["a", "b", "c", "a", "b", "c"], ["a", "c"]), ["b", "b"]);
	});
