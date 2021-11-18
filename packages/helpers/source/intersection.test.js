import { intersection } from "./intersection";

describe("#intersection", () => {
	test("should return the common values", () => {
		assert.is(intersection([2, 1], [2, 3]), [2]);
		assert.is(intersection([], []), []);
		assert.is(intersection(["a"], ["a"]), ["a"]);
		assert.is(intersection([true], [true]), [true]);
		assert.is(intersection([false], [false]), [false]);
	});
});
