import { maxBy } from "./max-by.js";

describe("#maxBy", () => {
	it("should work with a function", () => {
		assert.is(maxBy([{ n: 2 }, { n: 3 }, { n: 1 }, { n: 5 }, { n: 4 }], (o) => o.n)).toEqual({ n: 5 });
	});
});
