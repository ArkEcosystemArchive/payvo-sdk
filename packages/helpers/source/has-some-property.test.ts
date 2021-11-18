import { hasSomeProperty } from "./has-some-property.js";

let object;
beforeEach(() => (object = { property: undefined }));

describe("#hasSomeProperty", () => {
	it("should return true if the object has a given property", () => {
		assert.is(hasSomeProperty(object, ["property"]), true);
	});

	it("should return true if the object has any of the given properties", () => {
		assert.is(hasSomeProperty(object, ["not-present", "property"]), true);
	});

	it("should return false if the object doesn't have a given property", () => {
		assert.is(hasSomeProperty(object, ["not-present"]), false);
	});
});
