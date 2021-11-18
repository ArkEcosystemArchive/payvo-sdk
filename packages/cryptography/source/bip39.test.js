import { test } from "uvu";
import * as assert from "uvu/assert";

import { BIP39 } from "./bip39";

const english = "slogan miracle truck skate erosion huge bright where aspect rural average almost cram glide gown";
const japanese =
	"ひつぎ　ためる　むすぶ　ひかん　こうちゃ　すきま　えつらん　るいけい　いとこ　のちほど　いやす　あんまり　ぎしき　じだい　しなん";
const korean =
	"직업 여섯 포인트 지급 백색 손가락 그림 화요일 계절 정말 골짜기 개별 덩어리 상자 생신";
const chinese_simplified = "凤 谢 迈 霸 夫 祖 知 徙 合 恰 相 多 难 雨 孩";
const chinese_traditional = "鳳 謝 邁 霸 夫 祖 知 徙 合 恰 相 多 難 雨 孩";
const french =
	"remplir lézard temporel refuge éclipse furtif bermuda victoire angle pollen appeler affaire citoyen farine fermer";
const random = "@!#$^$%^&*&^(";

test("#generate", async () => {
	assert.type(BIP39.generate("chinese_simplified"), "string");
	assert.type(BIP39.generate("chinese_traditional"), "string");
	assert.type(BIP39.generate("english"), "string");
	assert.type(BIP39.generate("french"), "string");
	assert.type(BIP39.generate("italian"), "string");
	assert.type(BIP39.generate("japanese"), "string");
	assert.type(BIP39.generate("korean"), "string");
	assert.type(BIP39.generate("spanish"), "string");
});

test("#generate with number of words", async () => {
	assert.is(BIP39.generate("english").spltest(" ").length, 12);
	assert.is(BIP39.generate("english", 12).spltest(" ").length, 12);
	assert.is(BIP39.generate("english", 24).spltest(" ").length, 24);
	assert.is(BIP39.generate("english", 36).spltest(" ").length, 12);
});

test("#validate", async () => {
	assert.is(BIP39.validate(english, "english"), true);
	assert.is(BIP39.validate(japanese, "japanese"), true);
	assert.is(BIP39.validate(korean, "korean"), true);
	assert.is(BIP39.validate(chinese_simplified, "chinese_simplified"), true);
	assert.is(BIP39.validate(chinese_traditional, "chinese_traditional"), true);
	assert.is(BIP39.validate(french, "french"), true);
	assert.is(BIP39.validate(random, "english"), false);
});

test("#compatible", async () => {
	assert.is(BIP39.compatible(english), true);
	assert.is(BIP39.compatible(japanese), true);
	assert.is(BIP39.compatible(korean), true);
	assert.is(BIP39.compatible(chinese_simplified), true);
	assert.is(BIP39.compatible(chinese_traditional), true);
	assert.is(BIP39.compatible(french), true);
	assert.is(BIP39.compatible(random), false);
});

test("#toSeed", async () => {
	assert.type(BIP39.toSeed(english, "object");
	assert.type(BIP39.toSeed(japanese, "object");
	assert.type(BIP39.toSeed(korean, "object");
	assert.type(BIP39.toSeed(chinese_simplified, "object");
	assert.type(BIP39.toSeed(chinese_traditional, "object");
	assert.type(BIP39.toSeed(french, "object");
	assert.type(BIP39.toSeed(random, "object");
});

test("#toEntropy", async () => {
	assert.type(BIP39.toEntropy(english), "string");
});

test("#normalize", async () => {
	assert.is(BIP39.normalize(english), english);
	assert.is(BIP39.normalize(japanese), japanese);
	assert.is(BIP39.normalize(korean), korean);
	assert.is(BIP39.normalize(chinese_simplified), chinese_simplified);
	assert.is(BIP39.normalize(chinese_traditional), chinese_traditional);
	assert.is(BIP39.normalize(french), french);
	assert.is(BIP39.normalize(random), random);
});

test.run();
