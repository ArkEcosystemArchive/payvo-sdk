import { isDate } from "./is-date.js";

describe("#isDate", () => {
	it("should pass", () => {
		assert.is(isDate(new Date()), true);
	});

	it("should fail", () => {
		assert.is(isDate(1), false);
	});
});
