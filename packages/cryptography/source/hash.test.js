import { test } from "uvu";
import * as assert from 'uvu/assert';

import { Hash } from "./hash";

test("#ripemd160", () => {
	assert.is(Hash.ripemd160("Hello World").toString("hex"), "a830d7beb04eb7549ce990fb7dc962e499a27230");
});

test("#sha1", () => {
	assert.is(Hash.sha1("Hello World").toString("hex"), "0a4d55a8d778e5022fab701977c5d840bbc486d0");
});

test("#sha256", () => {
	assert.is(Hash.sha256("Hello World").toString("hex"), "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e");
});

test("#hash160", () => {
	assert.is(Hash.hash160("Hello World").toString("hex"), "bdfb69557966d026975bebe914692bf08490d8ca");
});

test("#hash256", () => {
	assert.is(Hash.hash256("Hello World").toString("hex"), "42a873ac3abd02122d27e80486c6fa1ef78694e8505fcec9cbcc8a7728ba8949");
});

test.run();
