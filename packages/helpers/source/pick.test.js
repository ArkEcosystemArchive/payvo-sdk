import { pick } from "./pick";

test("#pick", () => {
	test("should return an object with only the given properties", () => {
		assert.is(pick({ a: 1, b: "2", c: 3 }, ["a", "c"]), { a: 1, c: 3 });
	});
});
