import { describe } from "@payvo/sdk-test";

import { data, passphrase } from "../../../test/crypto/identity.json";
import { Keys } from "./keys.js";
import { WIF } from "./wif.js";

describe("WIF", ({ assert, it }) => {
	it("fromPassphrase", () => {
		assert.is(WIF.fromPassphrase(passphrase), data.wif);
	});

	it("fromKeys", () => {
		assert.is(WIF.fromKeys(Keys.fromPassphrase(passphrase)), data.wif);
	});
});
