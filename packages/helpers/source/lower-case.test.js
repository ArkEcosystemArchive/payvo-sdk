import { assert, test } from "@payvo/sdk-test";

import { lowerCase } from "./lower-case";

test("should turn any string into lower case", () => {
	assert.is(lowerCase("string"), "string");
	assert.is(lowerCase("camelCase"), "camel case");
	assert.is(lowerCase("param-case"), "param case");
	assert.is(lowerCase("PascalCase"), "pascal case");
	assert.is(lowerCase("UPPER_CASE"), "upper case");
	assert.is(lowerCase("snake_case"), "snake case");
	assert.is(lowerCase("sentence case"), "sentence case");
	assert.is(lowerCase("Title Case"), "title case");
	assert.is(lowerCase("dot.case"), "dot case");
});

test.run();