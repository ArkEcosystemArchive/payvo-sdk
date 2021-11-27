import { describe } from "@payvo/sdk-test";

import { randomBits } from "./random-bits";

describe("randomBits", async ({ assert, it, nock, loader }) => {
	it("should take bits and return a random hex string with a fixed length", () => {
		assert.length(randomBits(32).toString("hex"), 8);
		assert.length(randomBits(64).toString("hex"), 16);
		assert.length(randomBits(128).toString("hex"), 32);
		assert.length(randomBits(256).toString("hex"), 64);
		assert.length(randomBits(512).toString("hex"), 128);
		assert.length(randomBits(1024).toString("hex"), 256);
		assert.length(randomBits(2048).toString("hex"), 512);
		assert.length(randomBits(4096).toString("hex"), 1024);
	});
});
