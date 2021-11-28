import { describe } from "@payvo/sdk-test";

import { chars } from "./chars";

describe("chars", async ({ assert, it, nock, loader }) => {
	it("should return all characters of the string as an array", () => {
		assert.equal(chars("Hello World"), ["H", "e", "l", "l", "o", " ", "W", "o", "r", "l", "d"]);
	});
});
