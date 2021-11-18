import { chars } from "./chars";

describe("#chars", () => {
	test("should return all characters of the string as an array", () => {
		assert.is(chars("Hello World"), ["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d"]);
	});
});
