import { Manifest } from "./manifest";

test("#all", () => {
	assert.is(new Manifest({ key: "value" }).all()).toMatchInlineSnapshot(`
		Object {
		  "key": "value",
		}
	`);
});

test("#get", () => {
	assert.is(new Manifest({ key: "value" }).get("key"), "value");
	assert
		.is(() => new Manifest({ key: "value" }).get("keykey"))
		.toThrow("The [keykey] key does not exist in the manifest.");
});
