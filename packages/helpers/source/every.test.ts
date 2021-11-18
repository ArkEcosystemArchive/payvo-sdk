import { every } from "./every.js";
import { isBoolean } from "./is-boolean.js";

describe("#every", () => {
	it("should work with a functions", () => {
		assert.is(every([true, false], isBoolean), true);
		assert.is(every([true, false, "yes"], isBoolean), false);
	});
});
