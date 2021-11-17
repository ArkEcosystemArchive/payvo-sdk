import { Manifest } from "./manifest.js";

test("#all", () => {
	expect(new Manifest({ key: "value" }).all()).toMatchInlineSnapshot(`
		Object {
		  "key": "value",
		}
	`);
});

test("#get", () => {
	expect(new Manifest({ key: "value" }).get("key")).toBe("value");
	expect(() => new Manifest({ key: "value" }).get("keykey")).toThrow(
		"The [keykey] key does not exist in the manifest.",
	);
});
