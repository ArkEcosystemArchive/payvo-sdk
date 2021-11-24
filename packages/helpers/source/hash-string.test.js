import { describe } from "@payvo/sdk-test";

import { hashString } from "./hash-string";

describe("hashString", async ({ assert, it }) => {
	it("should return a number for the given string", function () {
		assert.is(hashString("Hello World"), 1661258373);
	});
});
