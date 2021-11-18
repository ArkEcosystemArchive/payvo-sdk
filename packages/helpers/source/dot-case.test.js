import { dotCase } from "./dot-case";

describe("#dotCase", () => {
	test("should turn any string into dot case", () => {
		assert.is(dotCase("string"), "string");
		assert.is(dotCase("camelCase"), "camel.case");
		assert.is(dotCase("param-case"), "param.case");
		assert.is(dotCase("PascalCase"), "pascal.case");
		assert.is(dotCase("UPPER_CASE"), "upper.case");
		assert.is(dotCase("snake_case"), "snake.case");
		assert.is(dotCase("sentence case"), "sentence.case");
		assert.is(dotCase("Title Case"), "title.case");
		assert.is(dotCase("dot.case"), "dot.case");
	});
});
