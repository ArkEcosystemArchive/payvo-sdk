import { describe } from "@payvo/sdk-test";

import { Hash } from "./hash";

describe("Hash", ({ assert, it }) => {
	it("should compute a RIPEMD160 hash for the given value", () => {
		assert.is(Hash.ripemd160("Hello World").toString("hex"), "a830d7beb04eb7549ce990fb7dc962e499a27230");
	});

	it("should compute a SHA1 hash for the given value", () => {
		assert.is(Hash.sha1("Hello World").toString("hex"), "0a4d55a8d778e5022fab701977c5d840bbc486d0");
	});

	it("should compute a SHA256 hash for the given value", () => {
		assert.is(
			Hash.sha256("Hello World").toString("hex"),
			"a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
		);
	});

	it("should compute a HASH160 hash for the given value", () => {
		assert.is(Hash.hash160("Hello World").toString("hex"), "bdfb69557966d026975bebe914692bf08490d8ca");
	});

	it("should compute a HASH256 hash for the given value", () => {
		assert.is(
			Hash.hash256("Hello World").toString("hex"),
			"42a873ac3abd02122d27e80486c6fa1ef78694e8505fcec9cbcc8a7728ba8949",
		);
	});
});
