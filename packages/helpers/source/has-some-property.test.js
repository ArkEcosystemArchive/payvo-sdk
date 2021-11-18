import { hasSomeProperty } from "./has-some-property";

let object;
test.before.each(() => (object = { property: undefined }));

describe("#hasSomeProperty", () => {
	test("should return true if the object has a given property", () => {
		assert.is(hasSomeProperty(object, ["property"]), true);
	});

	test("should return true if the object has any of the given properties", () => {
		assert.is(hasSomeProperty(object, ["not-present", "property"]), true);
	});

	test("should return false if the object doesn't have a given property", () => {
		assert.is(hasSomeProperty(object, ["not-present"]), false);
	});
});
