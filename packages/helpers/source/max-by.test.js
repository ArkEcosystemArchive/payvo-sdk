import { maxBy } from "./max-by";

test("#maxBy", () => {
	test("should work with a function", () => {
		assert.is(
			maxBy([{ n: 2 }, { n: 3 }, { n: 1 }, { n: 5 }, { n: 4 }], (o) => o.n),
			{ n: 5 },
		);
	});
});
