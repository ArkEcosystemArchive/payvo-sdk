import { compoundWords } from "./compound-words.js";

describe("#compoundWords", () => {
    it("should return undefined if the given string is empty", () => {
        assert.is(compoundWords("", (word) => word)), "undefined");
});

it("should return a list of words", () => {
    assert.is(
        compoundWords("fred, barney, & pebbles", (result: string, word: string) => `${result} ${word}`.trim()),
    , "fred barney pebbles");
});
});
