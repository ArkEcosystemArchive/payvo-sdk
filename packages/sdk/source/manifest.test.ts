import { describe } from "@payvo/sdk-test";

import { Manifest } from "./manifest.js";

describe("Manifest", ({ assert, it, nock, loader }) => {
	it("should get all values", () => {
		assert.equal(new Manifest({ key: "value" }).all(), {
			key: "value",
		});
	});

	it("should get a specific value", () => {
		assert.is(new Manifest({ key: "value" }).get("key"), "value");
		assert.throws(
			() => new Manifest({ key: "value" }).get("keykey"),
			"The [keykey] key does not exist in the manifest.",
		);
	});
});
