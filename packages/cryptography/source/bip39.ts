import { generateMnemonic, mnemonicToEntropy, mnemonicToSeedSync, validateMnemonic, wordlists } from "bip39";

/**
 * Implements all functionality that is required to create and validate BIP39
 * mnemonic passphrases which are used to generate deterministic private keys
 * which in turn are used to derive public keys and addresses for end-users.
 *
 * @remarks
 * BIP39 mnemonic passphrases should always be generated with 24 words if
 * they are supported. 12 words are already very secure but technology is
 * moving fast and mnemonic passphrases are rarely written out by hand.
 *
 * @see {@link https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki}
 *
 * @export
 * @class BIP39
 */
export class BIP39 {
	/**
	 * Generates a BIP39 compliant mnemonic passphrases.
	 *
	 * @static
	 * @param {string} [locale="english"]
	 * @param {number} [wordCount]
	 * @returns {string}
	 * @memberof BIP39
	 */
	public static generate(locale = "english", wordCount?: number): string {
		return generateMnemonic(wordCount === 24 ? 256 : 128, undefined, wordlists[locale]);
	}

	/**
	 * Validates that the input is a valid mnemonic passphrase in a specific language.
	 *
	 * @remarks
	 * Valid in this context means that it only contains words from the BIP39
	 * wordlists for the various languages that it supports.
	 *
	 * @static
	 * @param {string} mnemonic
	 * @param {string} [locale="english"]
	 * @returns {boolean}
	 * @memberof BIP39
	 */
	public static validate(mnemonic: string, locale = "english"): boolean {
		return validateMnemonic(BIP39.normalize(mnemonic), wordlists[locale]);
	}

	/**
	 * Validates that the input is a valid mnemonic passphrase in any language.
	 *
	 * @remarks
	 * Valid in this context means that it only contains words from the BIP39
	 * wordlists for the various languages that it supports.
	 *
	 * @static
	 * @param {string} mnemonic
	 * @returns {boolean}
	 * @memberof BIP39
	 */
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

	/**
	 * Turns the given mnemonic passphrase into a seed which can then be
	 * used for the derivation of a private key to derive a public key and
	 * an address from it which will be used to send and receive funds.
	 *
	 * @static
	 * @param {string} mnemonic
	 * @returns {Buffer}
	 * @memberof BIP39
	 */
	public static toSeed(mnemonic: string): Buffer {
		return mnemonicToSeedSync(BIP39.normalize(mnemonic));
	}

	/**
	 * Turns the given mnemonic passphrase into entropy which can then be
	 * used for the derivation of a private key to derive a public key and
	 * an address from it which will be used to send and receive funds.
	 *
	 * @static
	 * @param {string} mnemonic
	 * @returns {string}
	 * @memberof BIP39
	 */
	public static toEntropy(mnemonic: string): string {
		return mnemonicToEntropy(BIP39.normalize(mnemonic));
	}

	/**
	 * Normalises the mnemonic passphrase by ensuring a consistent encoding
	 * to avoid the loss of funds which could be caused by different encodings
	 * when going from asian to latin or cyrillic alphabets and character sets.
	 *
	 * @static
	 * @param {string} mnemonic
	 * @returns {string}
	 * @memberof BIP39
	 */
	public static normalize(mnemonic: string): string {
		return mnemonic.normalize("NFD");
	}
}
