import { words } from "./words.js";

describe("#words", () => {
	it("should work with words", () => {
		expect(words("fred, barney, & pebbles")).toEqual(["fred", "barney", "pebbles"]);
	});
});
