import { words } from "./words.js";

describe("#words", () => {
	it("should work with words", () => {
		assert.is(words("fred, barney, & pebbles")).toEqual(["fred", "barney", "pebbles"]);
	});
});
