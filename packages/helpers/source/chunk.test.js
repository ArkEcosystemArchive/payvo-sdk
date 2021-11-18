import { chunk } from "./chunk";

describe("#chunk", () => {
	test("should chunk the given array", () => {
		assert.is(chunk(["a", "b", "c", "d"], 2), [
			["a", "b"],
			["c", "d"],
		]);
		assert.is(chunk(["a", "b", "c", "d"], 3), [["a", "b", "c"], ["d"]]);
	});

	test("should not chunk if 0 is passed in", () => {
		assert.is(chunk(["a", "b", "c", "d"], 0), []);
	});

	test("should not chunk if a negative number is passed in", () => {
		assert.is(chunk(["a", "b", "c", "d"], -1), []);
	});
});
