import { describe } from "@payvo/sdk-test";

import { Uint8 } from "./uint8";

describe("Uint8", async ({ assert, it }) => {
	it("should turn an array into hex", () => {
		assert.is(Uint8.from([1, 2, 3]), "010203");
	});

	it("should turn hex into an array", () => {
		assert.equal(Uint8.toHex("010203"), Uint8Array.from([1, 2, 3]));
	});
});
