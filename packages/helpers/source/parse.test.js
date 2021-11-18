import { parse } from "./parse";

describe("#parse", () => {
	test("should parse valid json", () => {
		assert.is(parse("{}"), {});
	});

	test("should fail to parse invalid json", () => {
		assert.is(() => parse("{")).toThrow("Unexpected end of JSON input");
	});
});
