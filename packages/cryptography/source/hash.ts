import { ripemd160 } from "@noble/hashes/lib/ripemd160.js";
import { sha3_256 } from "@noble/hashes/lib/sha3.js";
import { sha256 } from "@noble/hashes/lib/sha256.js";

export class Hash {
	public static hash160(buffer: Buffer | string): Buffer {
		return Hash.ripemd160(Hash.sha256(buffer));
	}

	public static hash256(buffer: Buffer | string): Buffer {
		return Hash.sha256(Hash.sha256(buffer));
	}

	public static ripemd160(buffer: Buffer | string): Buffer {
		return Buffer.from(ripemd160(Hash.#bufferize(buffer)));
	}

	public static sha3(buffer: Buffer | string): Buffer {
		return Buffer.from(sha3_256(Hash.#bufferize(buffer)));
	}

	public static sha256(buffer: Buffer | string): Buffer {
		return Buffer.from(sha256(Hash.#bufferize(buffer)));
	}

	static #bufferize(buffer: Buffer | string) {
		return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
	}
}
