import { assert, test } from "@payvo/sdk-test";

import { constantCase } from "./constant-case";

test("#constantCase", () => {
	test("should turn any string into constant case", () => {
		assert.is(constantCase("string"), "STRING");
		assert.is(constantCase("camelCase"), "CAMEL_CASE");
		assert.is(constantCase("param-case"), "PARAM_CASE");
		assert.is(constantCase("PascalCase"), "PASCAL_CASE");
		assert.is(constantCase("UPPER_CASE"), "UPPER_CASE");
		assert.is(constantCase("snake_case"), "SNAKE_CASE");
		assert.is(constantCase("sentence case"), "SENTENCE_CASE");
		assert.is(constantCase("Title Case"), "TITLE_CASE");
		assert.is(constantCase("dot.case"), "DOT_CASE");
	});
