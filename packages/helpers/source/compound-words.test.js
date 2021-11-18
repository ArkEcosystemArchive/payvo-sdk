import { compoundWords } from "./compound-words";

describe("#compoundWords", () => {
    test("should return undefined if the given string is empty", () => {
        assert.is(compoundWords("", (word) => word)), "undefined");
});

test("should return a list of words", () => {
    assert.is(
        compoundWords("fred, barney, & pebbles", (result: string, word: string) => `${result} ${word}`.trim()),
    , "fred barney pebbles");
});
});
