import { assert, test } from "@payvo/sdk-test";

import { randomHex } from "./random-hex";

	test("should return a random hex string", () => {
		assert.length(randomHex(8), 8);
		assert.length(randomHex(16), 16);
		assert.length(randomHex(32), 32);
	});
