import { assert, test } from "@payvo/sdk-test";

import { pathCase } from "./path-case";

test("should turn any string into path case", () => {
	assert.is(pathCase("string"), "string");
	assert.is(pathCase("camelCase"), "camel/case");
	assert.is(pathCase("param-case"), "param/case");
	assert.is(pathCase("PascalCase"), "pascal/case");
	assert.is(pathCase("UPPER_CASE"), "upper/case");
	assert.is(pathCase("snake_case"), "snake/case");
	assert.is(pathCase("sentence case"), "sentence/case");
	assert.is(pathCase("Title Case"), "title/case");
	assert.is(pathCase("dot.case"), "dot/case");
});

test.run();