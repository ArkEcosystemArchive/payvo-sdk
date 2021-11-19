import { assert, test } from "@payvo/sdk-test";
import { Manifest } from "./manifest";

test("#all", () => {
	assert.equal(new Manifest({ key: "value" }).all(), {
		key: "value",
	});
});

test("#get", () => {
	assert.is(new Manifest({ key: "value" }).get("key"), "value");
	assert.throws(
		() => new Manifest({ key: "value" }).get("keykey"),
		"The [keykey] key does not exist in the manifest.",
	);
});
