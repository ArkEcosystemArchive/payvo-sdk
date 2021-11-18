import { parse } from "./parse.js";

describe("#parse", () => {
	it("should parse valid json", () => {
		assert.is(parse("{}"), {});
	});

	it("should fail to parse invalid json", () => {
		assert.is(() => parse("{")).toThrow("Unexpected end of JSON input");
	});
});
