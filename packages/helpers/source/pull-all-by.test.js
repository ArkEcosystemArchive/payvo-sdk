import { pullAllBy } from "./pull-all-by";

test("#pullAllBy", () => {
	test("should work with a function", () => {
		assert
			.is(pullAllBy([{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }], [{ x: 1 }, { x: 3 }], (o) => o.x))
			.toEqual([{ x: 2 }]);
	});
