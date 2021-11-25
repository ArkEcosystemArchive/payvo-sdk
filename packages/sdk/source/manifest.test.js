import { describe } from "@payvo/sdk-test";
import { Manifest } from "./manifest";

describe("Manifest", ({ assert, it }) => {
	it("should get all values", () => {
		assert.equal(new Manifest({ key: "value" }).all(), {
			key: "value",
		});
	});

	it("shoul get a specific value", () => {
		assert.is(new Manifest({ key: "value" }).get("key"), "value");
		assert.throws(
			() => new Manifest({ key: "value" }).get("keykey"),
			"The [keykey] key does not exist in the manifest.",
		);
	});
});
