import { describe } from "@payvo/sdk-test";

import { hasSomeProperty } from "./has-some-property";

let object;

describe("hasSomeProperty", async ({ assert, beforeEach, it }) => {
	beforeEach(() => (object = { property: undefined }));

	it("should return true if the object has a given property", () => {
		assert.true(hasSomeProperty(object, ["property"]));
	});

	it("should return true if the object has any of the given properties", () => {
		assert.true(hasSomeProperty(object, ["not-present", "property"]));
	});

	it("should return false if the object doesn't have a given property", () => {
		assert.false(hasSomeProperty(object, ["not-present"]));
	});
});
