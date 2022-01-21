import { describe } from "@payvo/sdk-test";

import { BIP38 } from "./bip38";
import { WIF } from "./wif.js";

describe("BIP38", ({ assert, it }) => {
	it("should encrypt the given value", async () => {
		const { compressed, privateKey } = WIF.decode("5KN7MzqK5wt2TP1fQCYyHBtDrXdJuXbUzm4A9rKAteGu3Qi5CVR");
		const mnemonic = "TestingOneTwoThree";

		assert.is(
			BIP38.encrypt(privateKey, mnemonic, compressed),
			"6PRVWUbkzzsbcVac2qwfssoUJAN1Xhrg6bNk8J7Nzm5H7kxEbn2Nh2ZoGg",
		);
	});

	it("should decrypt the given value", async () => {
		const mnemonic = "TestingOneTwoThree";

		assert.equal(BIP38.decrypt("6PRVWUbkzzsbcVac2qwfssoUJAN1Xhrg6bNk8J7Nzm5H7kxEbn2Nh2ZoGg", mnemonic), {
			compressed: false,
			privateKey: "cbf4b9f70470856bb4f40f80b87edb90865997ffee6df315ab166d713af433a5",
		});
	});

	it("should verify the given value", async () => {
		assert.is(BIP38.verify("6PRVWUbkzzsbcVac2qwfssoUJAN1Xhrg6bNk8J7Nzm5H7kxEbn2Nh2ZoGg"), true);
	});
});
