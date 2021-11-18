import { randomHex } from "./random-hex";

test("#randomHex", () => {
	test("should return a random hex string", () => {
		assert.is(randomHex(8)).toHaveLength(8);
		assert.is(randomHex(16)).toHaveLength(16);
		assert.is(randomHex(32)).toHaveLength(32);
	});
});
