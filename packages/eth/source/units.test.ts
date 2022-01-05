import { describe } from "@payvo/sdk-test";

import { toWei } from "./units";

describe("WalletData", async ({ assert, it }) => {
	it("should handle edge cases", () => {
		assert.equal(toWei(0, "wei").toString(10), "0");
		assert.equal(toWei("0.0", "wei").toString(10), "0");
		assert.equal(toWei(".3", "ether").toString(10), "300000000000000000");
		assert.throws(() => toWei(".", "wei"), Error);
		assert.throws(() => toWei("1.243842387924387924897423897423", "ether"), Error);
		assert.throws(() => toWei("8723.98234.98234", "ether"), Error);
	});

	it("should return the correct value", () => {
		assert.equal(toWei(1, "wei").toString(10), "1");
		assert.equal(toWei(1, "kwei").toString(10), "1000");
		assert.equal(toWei(1, "Kwei").toString(10), "1000");
		assert.equal(toWei(1, "babbage").toString(10), "1000");
		assert.equal(toWei(1, "mwei").toString(10), "1000000");
		assert.equal(toWei(1, "Mwei").toString(10), "1000000");
		assert.equal(toWei(1, "lovelace").toString(10), "1000000");
		assert.equal(toWei(1, "gwei").toString(10), "1000000000");
		assert.equal(toWei(1, "Gwei").toString(10), "1000000000");
		assert.equal(toWei(1, "shannon").toString(10), "1000000000");
		assert.equal(toWei(1, "szabo").toString(10), "1000000000000");
		assert.equal(toWei(1, "finney").toString(10), "1000000000000000");
		assert.equal(toWei(1, "ether").toString(10), "1000000000000000000");
		assert.equal(toWei(1, "kether").toString(10), "1000000000000000000000");
		assert.equal(toWei(1, "grand").toString(10), "1000000000000000000000");
		assert.equal(toWei(1, "mether").toString(10), "1000000000000000000000000");
		assert.equal(toWei(1, "gether").toString(10), "1000000000000000000000000000");
		assert.equal(toWei(1, "tether").toString(10), "1000000000000000000000000000000");

		assert.equal(toWei(1, "kwei").toString(10), toWei(1, "femtoether").toString(10));
		assert.equal(toWei(1, "szabo").toString(10), toWei(1, "microether").toString(10));
		assert.equal(toWei(1, "finney").toString(10), toWei(1, "milliether").toString(10));
		assert.equal(toWei(1, "milli").toString(10), toWei(1, "milliether").toString(10));
		assert.equal(toWei(1, "milli").toString(10), toWei(1000, "micro").toString(10));
	});
});
