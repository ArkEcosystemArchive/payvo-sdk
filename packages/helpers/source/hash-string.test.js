import { hashString } from "./hash-string";

describe("#hashString", () => {
	test("should return a number for the given string", function () {
		assert.is(hashString("Hello World"), 1661258373);
	});
});
