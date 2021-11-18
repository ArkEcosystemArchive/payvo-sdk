import { minBy } from "./min-by.js";

describe("#minBy", () => {
	it("should work with a function", () => {
		assert.is(minBy([{ n: 2 }, { n: 3 }, { n: 1 }, { n: 5 }, { n: 4 }], (o) => o.n)).toEqual({ n: 1 });
	});
});
