import { hasProperty } from "./has-property";

describe("#hasProperty", () => {
	it("should return true if the object has a given property", () => {
		assert.is(hasProperty({ property: undefined }, "property"), true);
	});

	it("should return false if the object doesn't have a given property", () => {
		assert.is(hasProperty({ property: undefined }, "not-present"), false);
	});
});
