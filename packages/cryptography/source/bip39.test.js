import { describe } from "@payvo/sdk-test";

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

describe("BIP39", ({ assert, it }) => {
	it("should generate a new mnemonic", async () => {
		assert.string(BIP39.generate("chinese_simplified"));
		assert.string(BIP39.generate("chinese_traditional"));
		assert.string(BIP39.generate("english"));
		assert.string(BIP39.generate("french"));
		assert.string(BIP39.generate("italian"));
		assert.string(BIP39.generate("japanese"));
		assert.string(BIP39.generate("korean"));
		assert.string(BIP39.generate("spanish"));
	});

	it("should generate a mnemonic with the given number of words", async () => {
		assert.length(BIP39.generate("english").split(" "), 12);
		assert.length(BIP39.generate("english", 12).split(" "), 12);
		assert.length(BIP39.generate("english", 24).split(" "), 24);
		assert.length(BIP39.generate("english", 36).split(" "), 12);
	});

	it("should validate the mnemonic", async () => {
		assert.true(BIP39.validate(english, "english"));
		assert.true(BIP39.validate(japanese, "japanese"));
		assert.true(BIP39.validate(korean, "korean"));
		assert.true(BIP39.validate(chinese_simplified, "chinese_simplified"));
		assert.true(BIP39.validate(chinese_traditional, "chinese_traditional"));
		assert.true(BIP39.validate(french, "french"));
		assert.false(BIP39.validate(random, "english"));
	});

	it("should determine if the mnemonic is compatible with the BIP39 spec", async () => {
		assert.true(BIP39.compatible(english));
		assert.true(BIP39.compatible(japanese));
		assert.true(BIP39.compatible(korean));
		assert.true(BIP39.compatible(chinese_simplified));
		assert.true(BIP39.compatible(chinese_traditional));
		assert.true(BIP39.compatible(french));
		assert.false(BIP39.compatible(random));
	});

	it("should transform the mnemonic into a seed", async () => {
		assert.object(BIP39.toSeed(english));
		assert.object(BIP39.toSeed(japanese));
		assert.object(BIP39.toSeed(korean));
		assert.object(BIP39.toSeed(chinese_simplified));
		assert.object(BIP39.toSeed(chinese_traditional));
		assert.object(BIP39.toSeed(french));
		assert.object(BIP39.toSeed(random));
	});

	it("should transform the mnemonic into entropy", async () => {
		assert.string(BIP39.toEntropy(english));
	});

	it("should normalize the mnemonic", async () => {
		assert.is(BIP39.normalize(english), english);
		assert.is(BIP39.normalize(japanese), japanese);
		assert.is(BIP39.normalize(korean), korean);
		assert.is(BIP39.normalize(chinese_simplified), chinese_simplified);
		assert.is(BIP39.normalize(chinese_traditional), chinese_traditional);
		assert.is(BIP39.normalize(french), french);
		assert.is(BIP39.normalize(random), random);
	});
});
