import { describe } from "@payvo/sdk-test";

import { CURRENCIES } from "./currencies.js";

describe("CURRENCIES", ({ assert, it, nock, loader }) => {
	it("should have a list of currencies", () => {
		assert.snapshot("currencies", CURRENCIES);
	});
});
