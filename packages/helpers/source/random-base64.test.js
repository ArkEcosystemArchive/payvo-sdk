import { randomBase64 } from "./random-base64";

describe("#randomBase64", () => {
	it("should return a random base64 string", () => {
		assert.is(randomBase64(8)).toHaveLength(8);
		assert.is(randomBase64(16)).toHaveLength(16);
		assert.is(randomBase64(32)).toHaveLength(32);
	});
});
