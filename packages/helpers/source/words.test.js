import { words } from "./words";

describe("#words", () => {
	test("should work with words", () => {
		assert.is(words("fred, barney, & pebbles"), ["fred", "barney", "pebbles"]);
	});
});
