import { sha256 } from "@noble/hashes/lib/sha256";
import { base58 } from "bstring";

const normalise = (value: string | Buffer): Buffer => (value instanceof Buffer ? value : Buffer.from(value));

const normaliseSHA256 = (value: string | Buffer) => sha256(sha256(normalise(value)));

const decodeRaw = (buffer: Buffer): Buffer | undefined => {
	const payload = buffer.slice(0, -4);
	const checksum = buffer.slice(-4);
	const newChecksum = normaliseSHA256(payload);

	if (
		(checksum[0] ^ newChecksum[0]) |
		(checksum[1] ^ newChecksum[1]) |
		(checksum[2] ^ newChecksum[2]) |
		(checksum[3] ^ newChecksum[3])
	) {
		return;
	}

	return payload;
};

/**
 * Implements all functionality that is required to work with the Base58
 * binary-to-text encoding scheme as defined by the specifications.
 *
 * @see {@link https://learnmeabitcoin.com/technical/base58}
 *
 * @export
 * @class Base58Check
 */
export class Base58Check {
	/**
	 * Encodes a string in compliance with the Base58 encoding scheme.
	 *
	 * @static
	 * @param {(string | Buffer)} value
	 * @returns {string}
	 * @memberof Base58Check
	 */
	public static encode(payload: string | Buffer): string {
		payload = normalise(payload);

		return base58.encode(Buffer.concat([payload, normaliseSHA256(payload)], payload.length + 4));
	}

	/**
	 * Decodes a string in compliance with the Base58 encoding scheme.
	 *
	 * @static
	 * @param {string} value
	 * @returns {Buffer}
	 * @memberof Base58Check
	 */
	public static decode(value: string): Buffer {
		const payload = decodeRaw(base58.decode(value));

		if (!payload) {
			throw new Error("Invalid checksum");
		}

		return payload;
	}
}
