import { describe } from "@payvo/sdk-test";

import { BIP44 } from "./bip44";

describe("BIP44", ({ assert, it, nock, loader }) => {
	it("should derive a child from the given path as object", async () => {
		assert.is(
			BIP44.deriveChild("praise you muffin lion enable neck grocery crumble super myself license ghost", {
				coinType: 1,
			}).toBase58(),
			"xprvA2hdDq2Hzo9LTv8NN925UXHToL1WbiGHkC7x64AUtoHQ5K7T1ZYkdXs5WFRKX7fx3vzVi4bTcAtpHqdpfVd1cVHuPU2bo1W3ozBJk1j9JXf",
		);
	});

	it("should derive a child from the given path as object and return its path", async () => {
		const { child, path } = BIP44.deriveChildWithPath(
			"praise you muffin lion enable neck grocery crumble super myself license ghost",
			{
				account: 3,
				change: 4,
				coinType: 2,
				index: 5,
				purpose: 1,
			},
		);

		assert.type(child, "object");
		assert.type(path, "string");
	});

	it("should derive a child from the given path as string", async () => {
		assert.is(
			BIP44.deriveChildFromPath(
				"praise you muffin lion enable neck grocery crumble super myself license ghost",
				"m/0/0",
			).toBase58(),
			"xprv9wMjT6HUeJy2LQqk1GRdSkiJRBxxurasRZ8aU2wBktamDQ282PM9t1cmxCf5bhUoz19KNJAwAYeTEExUkxzinFSb7bRDdnWcytMGj53aKcH",
		);
	});

	it("should stringify the given value", async () => {
		assert.type(
			BIP44.stringify({
				account: 3,
				change: 4,
				coinType: 2,
				index: 5,
				purpose: 1,
			}),
			"string",
		);
	});

	it("should parse BIP44 paths", async () => {
		const bip44Levels = BIP44.parse("m/44'/1'/2'/3/4");

		assert.is(bip44Levels.purpose, 44);
		assert.is(bip44Levels.coinType, 1);
		assert.is(bip44Levels.account, 2);
		assert.is(bip44Levels.change, 3);
		assert.is(bip44Levels.addressIndex, 4);
	});

	it("should parse BIP49 paths", async () => {
		const bip44Levels = BIP44.parse("m/49'/1'/2'/3/4");

		assert.is(bip44Levels.purpose, 49);
		assert.is(bip44Levels.coinType, 1);
		assert.is(bip44Levels.account, 2);
		assert.is(bip44Levels.change, 3);
		assert.is(bip44Levels.addressIndex, 4);
	});

	it("should parse BIP84 paths", async () => {
		const bip44Levels = BIP44.parse("m/84'/1'/2'/3/4");

		assert.is(bip44Levels.purpose, 84);
		assert.is(bip44Levels.coinType, 1);
		assert.is(bip44Levels.account, 2);
		assert.is(bip44Levels.change, 3);
		assert.is(bip44Levels.addressIndex, 4);
	});

	it("should throw if it fails to parse a path", async () => {
		assert.throws(() => BIP44.parse("m/1'/1'/2'/3/4"));
	});
});
