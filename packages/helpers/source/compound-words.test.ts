import { compoundWords } from "./compound-words.js";

describe("#compoundWords", () => {
	it("should return undefined if the given string is empty", () => {
		expect(compoundWords("", (word) => word)).toBeUndefined();
	});

	it("should return a list of words", () => {
		expect(
			compoundWords("fred, barney, & pebbles", (result: string, word: string) => `${result} ${word}`.trim()),
		).toEqual("fred barney pebbles");
	});
});
