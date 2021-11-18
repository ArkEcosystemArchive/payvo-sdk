import { assert, test } from "@payvo/sdk-test";

import { parse } from "./parse";

test("should parse valid json", () => {
	assert.equal(parse("{}"), {});
});

test("should fail to parse invalid json", () => {
	assert.throws(() => parse("{"), "Unexpected end of JSON input");
});

test.run();
