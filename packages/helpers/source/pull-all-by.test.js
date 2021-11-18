import { pullAllBy } from "./pull-all-by";

	test("should work with a function", () => {
		assert
			.equal(pullAllBy([{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }], [{ x: 1 }, { x: 3 }], (o) => o.x), [{ x: 2 }]);
	});
