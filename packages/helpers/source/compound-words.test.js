import { assert, test } from "@payvo/sdk-test";

import { compoundWords } from "./compound-words";

test("should return undefined if the given string is empty", () => {
	assert.undefined(compoundWords("", (word) => word));
});

test("should return a list of words", () => {
	assert.is(
		compoundWords("fred, barney, & pebbles", (result, word) => `${result} ${word}`.trim()),
		"fred barney pebbles",
	);
});

test.run();
