import { assert, test } from "@payvo/sdk-test";

import { randomBase64 } from "./random-base64";

test("should return a random base64 string", () => {
	assert.length(randomBase64(8), 8);
	assert.length(randomBase64(16), 16);
	assert.length(randomBase64(32), 32);
});

test.run();
