import { isDate } from "./is-date";

describe("#isDate", () => {
	test("should pass", () => {
		assert.is(isDate(new Date()), true);
	});

	test("should fail", () => {
		assert.is(isDate(1), false);
	});
});
