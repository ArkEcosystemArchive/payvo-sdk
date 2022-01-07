import { generateMnemonic, mnemonicToEntropy, mnemonicToSeedSync, validateMnemonic } from "micro-bip39";
import { wordlist as czech } from "micro-bip39/wordlists/czech.js";
import { wordlist as english } from "micro-bip39/wordlists/english.js";
import { wordlist as french } from "micro-bip39/wordlists/french.js";
import { wordlist as italian } from "micro-bip39/wordlists/italian.js";
import { wordlist as japanese } from "micro-bip39/wordlists/japanese.js";
import { wordlist as korean } from "micro-bip39/wordlists/korean.js";
import { wordlist as chinese_simplified } from "micro-bip39/wordlists/simplified-chinese.js";
import { wordlist as spanish } from "micro-bip39/wordlists/spanish.js";
import { wordlist as chinese_traditional } from "micro-bip39/wordlists/traditional-chinese.js";

const wordlists = {
	chinese_simplified,
	chinese_traditional,
	czech,
	english,
	french,
	italian,
	japanese,
	korean,
	spanish,
};

const getWordList = (locale: string): string[] => wordlists[locale] || wordlists.english;

export class BIP39 {
	public static generate(locale = "english", wordCount?: number): string {
		return generateMnemonic(getWordList(locale), wordCount === 24 ? 256 : 128);
	}

	public static validate(mnemonic: string, locale = "english"): boolean {
		return validateMnemonic(BIP39.normalize(mnemonic), getWordList(locale));
	}

	public static compatible(mnemonic: string): boolean {
		const locales: string[] = [
			"english", // most common so we try that first for an early return
			"chinese_simplified",
			"chinese_traditional",
			"czech",
			"french",
			"italian",
			"japanese",
			"korean",
			"portuguese",
			"spanish",
		];

		for (const locale of locales) {
			if (BIP39.validate(mnemonic, locale)) {
				return true;
			}
		}

		return false;
	}

	public static toSeed(mnemonic: string): Uint8Array {
		return mnemonicToSeedSync(BIP39.normalize(mnemonic));
	}

	public static toEntropy(mnemonic: string, locale = "english"): Uint8Array {
		return mnemonicToEntropy(BIP39.normalize(mnemonic), getWordList(locale));
	}

	public static normalize(mnemonic: string): string {
		return mnemonic.normalize("NFD");
	}
}
