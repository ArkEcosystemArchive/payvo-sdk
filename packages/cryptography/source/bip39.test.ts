import { describeWithContext } from "@payvo/sdk-test";

import { BIP39 } from "./bip39";

describeWithContext(
	"BIP39",
	{
		chinese_simplified: "凤 谢 迈 霸 夫 祖 知 徙 合 恰 相 多 难 雨 孩",
		chinese_traditional: "鳳 謝 邁 霸 夫 祖 知 徙 合 恰 相 多 難 雨 孩",
		english: "slogan miracle truck skate erosion huge bright where aspect rural average almost cram glide gown",
		french: "remplir lézard temporel refuge éclipse furtif bermuda victoire angle pollen appeler affaire citoyen farine fermer",
		japanese:
			"ひつぎ　ためる　むすぶ　ひかん　こうちゃ　すきま　えつらん　るいけい　いとこ　のちほど　いやす　あんまり　ぎしき　じだい　しなん",
		korean: "직업 여섯 포인트 지급 백색 손가락 그림 화요일 계절 정말 골짜기 개별 덩어리 상자 생신",
		random: "@!#$^$%^&*&^(",
	},
	({ assert, it }) => {
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

		it("should validate the mnemonic", async (context) => {
			assert.true(BIP39.validate(context.english, "english"));
			assert.true(BIP39.validate(context.japanese, "japanese"));
			assert.true(BIP39.validate(context.korean, "korean"));
			assert.true(BIP39.validate(context.chinese_simplified, "chinese_simplified"));
			assert.true(BIP39.validate(context.chinese_traditional, "chinese_traditional"));
			assert.true(BIP39.validate(context.french, "french"));
			assert.false(BIP39.validate(context.random, "english"));
		});

		it("should determine if the mnemonic is compatible with the BIP39 spec", async (context) => {
			assert.true(BIP39.compatible(context.english));
			assert.true(BIP39.compatible(context.japanese));
			assert.true(BIP39.compatible(context.korean));
			assert.true(BIP39.compatible(context.chinese_simplified));
			assert.true(BIP39.compatible(context.chinese_traditional));
			assert.true(BIP39.compatible(context.french));
			assert.false(BIP39.compatible(context.random));
		});

		it("should transform the mnemonic into a seed", async (context) => {
			assert.object(BIP39.toSeed(context.english));
			assert.object(BIP39.toSeed(context.japanese));
			assert.object(BIP39.toSeed(context.korean));
			assert.object(BIP39.toSeed(context.chinese_simplified));
			assert.object(BIP39.toSeed(context.chinese_traditional));
			assert.object(BIP39.toSeed(context.french));
			assert.object(BIP39.toSeed(context.random));
		});

		it("should transform the mnemonic into entropy", async (context) => {
			assert.object(BIP39.toEntropy(context.english));
		});

		it("should normalize the mnemonic", async (context) => {
			assert.is(BIP39.normalize(context.english), context.english);
			assert.is(BIP39.normalize(context.japanese), context.japanese);
			assert.is(BIP39.normalize(context.korean), context.korean);
			assert.is(BIP39.normalize(context.chinese_simplified), context.chinese_simplified);
			assert.is(BIP39.normalize(context.chinese_traditional), context.chinese_traditional);
			assert.is(BIP39.normalize(context.french), context.french);
			assert.is(BIP39.normalize(context.random), context.random);
		});
	},
);
