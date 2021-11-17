import { test } from "uvu";
import * as assert from 'uvu/assert';

import { BIP44 } from "./bip44";

test("#deriveChild", async () => {
	assert.is(
		BIP44.deriveChild("praise you muffin lion enable neck grocery crumble super myself license ghost", {
			coinType: 1,
		}).toBase58(),
		"xprvA2hdDq2Hzo9LTv8NN925UXHToL1WbiGHkC7x64AUtoHQ5K7T1ZYkdXs5WFRKX7fx3vzVi4bTcAtpHqdpfVd1cVHuPU2bo1W3ozBJk1j9JXf",
	);
});

test("#deriveChildWithPath", async () => {
	const { child, path } = BIP44.deriveChildWithPath("praise you muffin lion enable neck grocery crumble super myself license ghost", {
		account: 3,
		change: 4,
		coinType: 2,
		index: 5,
		purpose: 1,
	});

	assert.type(child, "object");
	assert.type(path, "string");
});

test("#deriveChildFromPath", async () => {
	assert.is(
		BIP44.deriveChildFromPath(
			"praise you muffin lion enable neck grocery crumble super myself license ghost",
			"m/0/0",
		).toBase58(),
		"xprv9wMjT6HUeJy2LQqk1GRdSkiJRBxxurasRZ8aU2wBktamDQ282PM9t1cmxCf5bhUoz19KNJAwAYeTEExUkxzinFSb7bRDdnWcytMGj53aKcH",
	);
});

test("#stringify", async () => {
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

test("#parse - bip44 address", async () => {
	const bip44Levels = BIP44.parse("m/44'/1'/2'/3/4");

	assert.is(bip44Levels.purpose, 44);
	assert.is(bip44Levels.coinType, 1);
	assert.is(bip44Levels.account, 2);
	assert.is(bip44Levels.change, 3);
	assert.is(bip44Levels.addressIndex, 4);
});

test("#parse - bip49 address", async () => {
	const bip44Levels = BIP44.parse("m/49'/1'/2'/3/4");

	assert.is(bip44Levels.purpose, 49);
	assert.is(bip44Levels.coinType, 1);
	assert.is(bip44Levels.account, 2);
	assert.is(bip44Levels.change, 3);
	assert.is(bip44Levels.addressIndex, 4);
});

test("#parse - bip84 address", async () => {
	const bip44Levels = BIP44.parse("m/84'/1'/2'/3/4");

	assert.is(bip44Levels.purpose, 84);
	assert.is(bip44Levels.coinType, 1);
	assert.is(bip44Levels.account, 2);
	assert.is(bip44Levels.change, 3);
	assert.is(bip44Levels.addressIndex, 4);
});

test("#parse - invalid bip", async () => {
	assert.throws(() => BIP44.parse("m/1'/1'/2'/3/4"));
});

test.run();
