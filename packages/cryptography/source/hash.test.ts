import { describe } from "@payvo/sdk-test";

import { Hash } from "./hash";

describe("Hash", ({ assert, it }) => {
	it("should compute a RIPEMD160 hash for the given value", () => {
		assert.is(Hash.ripemd160("Hello World").toString("hex"), "a830d7beb04eb7549ce990fb7dc962e499a27230");
	});

	it("should compute a SHA256 hash for the given value", async () => {
		assert.is(
			Hash.sha256("Hello World").toString("hex"),
			"a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
		);
	});
});
