import { describe } from "@payvo/sdk-test";

import { randomHex } from "./random-hex";

describe("randomHex", async ({ assert, it, nock, loader }) => {
	it("should return a random hex string", () => {
		assert.length(randomHex(8), 8);
		assert.length(randomHex(16), 16);
		assert.length(randomHex(32), 32);
	});
});
