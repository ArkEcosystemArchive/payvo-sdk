import { isMap } from "./is-map";

describe("#isMap", () => {
	it("should pass", () => {
		assert.is(isMap(new Map()), true);
	});

	it("should fail", () => {
		assert.is(isMap(1), false);
	});
});
