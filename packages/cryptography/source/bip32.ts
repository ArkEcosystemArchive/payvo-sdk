/* eslint-disable import/no-namespace */

import BIP32Factory, { BIP32Interface } from "bip32";
import * as ecc from "tiny-secp256k1";

import { BIP39 } from "./bip39.js";

interface Network {
	bip32: {
		private: number;
		public: number;
	};
	wif: number;
}

// @ts-ignore
const bip32 = BIP32Factory(ecc);

/**
 * Implements all functionality that is required to work with BIP32 to create
 * hierarchical deterministic wallets in compliant with the specifications.
 *
 * @see {@link https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki}
 *
 * @export
 * @class BIP32
 */
class BIP32 {
	/**
	 * Derives a BIP32 key from a mnemonic passphrase.
	 *
	 * @remarks
	 * Before deriving the BIP32 key the mnemonic passphrase will be
	 * normalised and validated to ensure that no loss of funds is
	 * possible due to importing false data which might confuse a users.
	 *
	 * @static
	 * @param {string} mnemonic
	 * @param {Network} network
	 * @returns {BIP32Interface}
	 * @memberOf BIP32
	 */
	public static fromMnemonic(mnemonic: string, network?: Network): BIP32Interface {
		mnemonic = BIP39.normalize(mnemonic);

		BIP39.validate(mnemonic);

		return bip32.fromSeed(BIP39.toSeed(mnemonic), network);
	}

	/**
	 * Derives a BIP32 key from a seed.
	 *
	 * @static
	 * @param {string} seed
	 * @param {Network} network
	 * @returns {BIP32Interface}
	 * @memberOf BIP32
	 */
	public static fromSeed(seed: string, network?: Network): BIP32Interface {
		return bip32.fromSeed(Buffer.from(seed, "hex"), network);
	}

	/**
	 * Derives a BIP32 key from a base58 encoded private key.
	 *
	 * @static
	 * @param {string} value
	 * @param {Network} network
	 * @returns {BIP32Interface}
	 * @memberOf BIP32
	 */
	public static fromBase58(value: string, network?: Network): BIP32Interface {
		return bip32.fromBase58(value, network);
	}

	/**
	 * Derives a BIP32 key from a hex public key.
	 *
	 * @static
	 * @param {string} publicKey
	 * @param {string} chainCode
	 * @param {Network} network
	 * @returns {BIP32Interface}
	 * @memberOf BIP32
	 */
	public static fromPublicKey(publicKey: string, chainCode: string, network?: Network): BIP32Interface {
		return bip32.fromPublicKey(Buffer.from(publicKey, "hex"), Buffer.from(chainCode, "hex"), network);
	}

	/**
	 * Derives a BIP32 key from a hex private key.
	 *
	 * @static
	 * @param {string} privateKey
	 * @param {string} chainCode
	 * @param {Network} network
	 * @returns {BIP32Interface}
	 * @memberOf BIP32
	 */
	public static fromPrivateKey(privateKey: string, chainCode: string, network?: Network): BIP32Interface {
		return bip32.fromPrivateKey(Buffer.from(privateKey, "hex"), Buffer.from(chainCode, "hex"), network);
	}
}

export { BIP32 };

export { BIP32Interface } from "bip32";
