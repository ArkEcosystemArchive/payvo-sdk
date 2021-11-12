/* eslint-disable unicorn/no-object-as-default-parameter */

import createXpub from "create-xpub";
import Base, { fromExtendedKey, fromMasterSeed } from "hdkey";

const normalise = (value: string | Buffer) => (value instanceof Buffer ? value : Buffer.from(value, "hex"));

/**
 *
 *
 * @export
 * @class HDKey
 */
export class HDKey {
	/**
	 *
	 *
	 * @static
	 * @param {(string | Buffer)} seed
	 * @returns {Base}
	 * @memberof HDKey
	 */
	public static fromSeed(seed: string | Buffer): Base {
		return fromMasterSeed(normalise(seed));
	}

	/**
	 *
	 *
	 * @static
	 * @param {string} publicKey
	 * @returns {Base}
	 * @memberof HDKey
	 */
	public static fromExtendedPublicKey(publicKey: string): Base {
		if (!publicKey.startsWith("xpub")) {
			throw new Error("The given key is not an extended public key.");
		}

		return fromExtendedKey(publicKey);
	}

	/**
	 *
	 *
	 * @static
	 * @param {string} privateKey
	 * @returns {Base}
	 * @memberof HDKey
	 */
	public static fromExtendedPrivateKey(privateKey: string): Base {
		if (!privateKey.startsWith("xprv")) {
			throw new Error("The given key is not an extended private key.");
		}

		return fromExtendedKey(privateKey);
	}

	/**
	 *
	 *
	 * @static
	 * @param {string} publicKey
	 * @param {{ depth: number; childNumber: number }} [options={ depth: 0, childNumber: 2147483648 }]
	 * @returns {Base}
	 * @memberof HDKey
	 */
	public static fromCompressedPublicKey(
		publicKey: string,
		options: { depth: number; childNumber: number } = { childNumber: 2_147_483_648, depth: 0 },
	): Base {
		return HDKey.fromExtendedPublicKey(
			createXpub({
				// Account 0 = 0 + 0x80000000
				chainCode: publicKey.slice(-64),

				childNumber: options.childNumber,
				depth: options.depth,
				publicKey: publicKey.slice(0, 66),
			}),
		);
	}
}
