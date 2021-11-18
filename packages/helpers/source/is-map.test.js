import { isMap } from "./is-map";

describe("#isMap", () => {
	test("should pass", () => {
		assert.is(isMap(new Map()), true);
	});

	test("should fail", () => {
		assert.is(isMap(1), false);
	});
});
