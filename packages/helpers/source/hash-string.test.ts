import { hashString } from "./hash-string.js";

describe("#hashString", () => {
	it("should return a number for the given string", function () {
		assert.is(hashString("Hello World"), 1661258373);
	});
});
