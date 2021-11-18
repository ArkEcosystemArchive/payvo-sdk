import { assert, test } from "@payvo/sdk-test";

import { hasSomeProperty } from "./has-some-property";

let object;
test.before.each(() => (object = { property: undefined }));

test("should return true if the object has a given property", () => {
	assert.true(hasSomeProperty(object, ["property"]));
});

test("should return true if the object has any of the given properties", () => {
	assert.true(hasSomeProperty(object, ["not-present", "property"]));
});

test("should return false if the object doesn't have a given property", () => {
	assert.false(hasSomeProperty(object, ["not-present"]));
});

test.run();
