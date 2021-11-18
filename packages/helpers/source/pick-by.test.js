import { isNumber } from "./is-number";
import { pickBy } from "./pick-by";

test("#pickBy", () => {
	test("should work with a function", () => {
		assert.is(pickBy({ a: 1, b: "2", c: 3 }, isNumber), { a: 1, c: 3 });
	});
});
