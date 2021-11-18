import { pick } from "./pick.js";

describe("#pick", () => {
	it("should return an object with only the given properties", () => {
		assert.is(pick({ a: 1, b: "2", c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
	});
});
