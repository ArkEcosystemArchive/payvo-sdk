// Based on https://github.com/bitcoinjs/bip38/blob/master/index.js

import { scrypt } from "@noble/hashes/scrypt";
import BigInteger from "bigi";
import { Buffer } from "buffer";
import { createCipheriv, createDecipheriv } from "crypto";

import { Base58Check } from "./base58-check.js";
import { secp256k1 } from "./ecurve/names.js";
import { Hash } from "./hash.js";

// constants
const SCRYPT_PARAMS = {
	N: 16_384,
	p: 8,
	r: 8,
};

const NULL = Buffer.alloc(0);

class Implementation {
	public encrypt(privateKey: string | Buffer, mnemonic: string, compressed = true): string {
		// Prepare
		const buffer: Buffer = Buffer.isBuffer(privateKey) ? privateKey : Buffer.from(privateKey, "hex");

		if (buffer.length !== 32) {
			throw new Error("Invalid private key length");
		}

		const address: string = this.#getAddress(BigInteger.fromBuffer(buffer), compressed);
		const N = SCRYPT_PARAMS.N;
		const p = SCRYPT_PARAMS.p;
		const r = SCRYPT_PARAMS.r;
		const salt = Hash.hash256(Buffer.from(address)).slice(0, 4);
		const secret = Buffer.from(mnemonic.normalize("NFC"), "utf8");

		// Finalise
		const scryptBuf = scrypt(secret, salt, { N, dkLen: 64, p, r });
		const derivedHalf1 = scryptBuf.slice(0, 32);
		const derivedHalf2 = scryptBuf.slice(32, 64);

		const xorBuf = this.#xor(derivedHalf1, buffer);
		const cipher = createCipheriv("aes-256-ecb", derivedHalf2, NULL);
		cipher.setAutoPadding(false);
		cipher.end(xorBuf);

		const cipherText = cipher.read();

		// 0x01 | 0x42 | flagByte | salt (4) | cipherText (32)
		const result = Buffer.allocUnsafe(7 + 32);
		result.writeUInt8(0x01, 0);
		result.writeUInt8(0x42, 1);
		result.writeUInt8(compressed ? 0xe0 : 0xc0, 2);
		salt.copy(result, 3);
		cipherText.copy(result, 7);

		return Base58Check.encode(result);
	}

	public decrypt(value: string, mnemonic: string): { compressed: boolean; privateKey: string } {
		const buffer = Base58Check.decode(value);

		const { salt, compressed, N, r, p, decryptEC } = this.#prepareDecryptRaw(buffer);

		let result: {
			compressed: any;
			privateKey: Uint8Array;
		};

		if (decryptEC === true) {
			result = this.#decryptECMult(buffer, mnemonic);
		} else {
			result = this.#finishDecryptRaw(
				buffer,
				salt,
				compressed,
				scrypt(mnemonic.normalize("NFC"), salt, { N, dkLen: 64, p, r }),
			);
		}

		return {
			compressed: result.compressed,
			privateKey: Buffer.from(result.privateKey).toString("hex"),
		};
	}

	public verify(value: string): boolean {
		let decoded: Buffer;

		try {
			decoded = Base58Check.decode(value);
		} catch {
			return false;
		}

		if (!decoded) {
			return false;
		}

		if (decoded.length !== 39) {
			return false;
		}

		if (decoded.readUInt8(0) !== 0x01) {
			return false;
		}

		const type = decoded.readUInt8(1);
		const flag = decoded.readUInt8(2);

		// @TODO: untangle this IF mess with early returns

		// encrypted WIF
		if (type === 0x42) {
			if (flag !== 0xc0 && flag !== 0xe0) {
				return false;
			}

			// EC mult
		} else if (type === 0x43) {
			if (flag & ~0x24) {
				return false;
			}
		} else {
			return false;
		}

		return true;
	}

	#xor(a: Uint8Array, b: Uint8Array) {
		const length = Math.min(a.length, b.length);

		for (let index = 0; index < length; ++index) {
			a[index] = a[index] ^ b[index];
		}

		return a;
	}

	#getAddress(d: BigInteger, compressed: boolean): string {
		const Q = secp256k1.G.multiply(d).getEncoded(compressed);
		const hash = Hash.hash160(Q);
		const payload = Buffer.allocUnsafe(21);
		payload.writeUInt8(0x00, 0);
		hash.copy(payload, 1);

		return Base58Check.encode(payload);
	}

	#prepareDecryptRaw(buffer: Buffer): any {
		// 39 bytes: 2 bytes prefix, 37 bytes payload
		if (buffer.length !== 39) {
			throw new Error("Invalid BIP38 data length");
		}
		if (buffer.readUInt8(0) !== 0x01) {
			throw new Error("Invalid BIP38 prefix");
		}

		// check if BIP38 EC multiply
		const type = buffer.readUInt8(1);
		if (type === 0x43) {
			return { decryptEC: true };
		}
		if (type !== 0x42) {
			throw new Error("Invalid BIP38 type");
		}

		const flagByte = buffer.readUInt8(2);
		const compressed = flagByte === 0xe0;
		if (!compressed && flagByte !== 0xc0) {
			throw new Error("Invalid BIP38 compression flag");
		}

		return {
			N: SCRYPT_PARAMS.N,
			compressed,
			p: SCRYPT_PARAMS.p,
			r: SCRYPT_PARAMS.r,
			salt: buffer.slice(3, 7),
		};
	}

	#finishDecryptRaw(buffer: Buffer, salt: Buffer, compressed: boolean, scryptBuf: Uint8Array) {
		const derivedHalf1 = scryptBuf.slice(0, 32);
		const derivedHalf2 = scryptBuf.slice(32, 64);

		const privKeyBuf = buffer.slice(7, 7 + 32);
		const decipher = createDecipheriv("aes-256-ecb", derivedHalf2, NULL);
		decipher.setAutoPadding(false);
		decipher.end(privKeyBuf);

		const plainText = decipher.read();
		const privateKey = this.#xor(derivedHalf1, plainText);

		// verify salt matches address
		const address = this.#getAddress(BigInteger.fromBuffer(privateKey), compressed);
		const checksum = Hash.hash256(Buffer.from(address)).slice(0, 4);

		if (salt.compare(checksum) !== 0) {
			throw new Error("Cannot decrypt: salt and checksum do not match.");
		}

		return {
			compressed,
			privateKey,
		};
	}

	#getPassIntAndPoint(preFactor: Uint8Array, ownerEntropy: Buffer, hasLotSeq: boolean) {
		let passFactor;
		if (hasLotSeq) {
			const hashTarget = Buffer.concat([preFactor, ownerEntropy]);
			passFactor = Hash.hash256(hashTarget);
		} else {
			passFactor = preFactor;
		}
		const passInt = BigInteger.fromBuffer(passFactor);
		return {
			passInt,
			passPoint: secp256k1.G.multiply(passInt).getEncoded(true),
		};
	}

	#prepareDecryptECMult(buffer: Buffer) {
		const flag = buffer.readUInt8(1);
		const compressed = (flag & 0x20) !== 0;
		const hasLotSeq = (flag & 0x04) !== 0;

		if ((flag & 0x24) !== flag) {
			throw new Error("Invalid private key.");
		}

		const addressHash = buffer.slice(2, 6);
		const ownerEntropy = buffer.slice(6, 14);
		let ownerSalt;

		// 4 bytes ownerSalt if 4 bytes lot/sequence
		if (hasLotSeq) {
			ownerSalt = ownerEntropy.slice(0, 4);

			// else, 8 bytes ownerSalt
		} else {
			ownerSalt = ownerEntropy;
		}

		const encryptedPart1 = buffer.slice(14, 22); // First 8 bytes
		const encryptedPart2 = buffer.slice(22, 38); // 16 bytes

		return {
			N: SCRYPT_PARAMS.N,
			addressHash,
			compressed,
			encryptedPart1,
			encryptedPart2,
			hasLotSeq,
			ownerEntropy,
			ownerSalt,
			p: SCRYPT_PARAMS.p,
			r: SCRYPT_PARAMS.r,
		};
	}

	#decryptECMult(buffer: Buffer, passphrase: string) {
		buffer = buffer.slice(1); // FIXME: we can avoid this

		const { addressHash, encryptedPart1, encryptedPart2, ownerEntropy, ownerSalt, hasLotSeq, compressed, N, r, p } =
			this.#prepareDecryptECMult(buffer);

		const { passInt, passPoint } = this.#getPassIntAndPoint(
			scrypt(Buffer.from(passphrase.normalize("NFC"), "utf8"), ownerSalt, { N, dkLen: 32, p, r }),
			ownerEntropy,
			hasLotSeq,
		);

		return this.#finishDecryptECMult(
			scrypt(passPoint, Buffer.concat([addressHash, ownerEntropy]), { N: 1024, dkLen: 64, p: 1, r: 1 }),
			encryptedPart1,
			encryptedPart2,
			passInt,
			compressed,
		);
	}

	#finishDecryptECMult(
		seedBPass: Uint8Array,
		encryptedPart1: Buffer,
		encryptedPart2: Buffer,
		passInt: BigInteger,
		compressed: boolean,
	) {
		const derivedHalf1 = seedBPass.slice(0, 32);
		const derivedHalf2 = seedBPass.slice(32, 64);

		const decipher = createDecipheriv("aes-256-ecb", derivedHalf2, Buffer.alloc(0));
		decipher.setAutoPadding(false);
		decipher.end(encryptedPart2);

		const decryptedPart2 = decipher.read();
		const temporary = this.#xor(decryptedPart2, derivedHalf1.slice(16, 32));
		const seedBPart2 = temporary.slice(8, 16);

		const decipher2 = createDecipheriv("aes-256-ecb", derivedHalf2, Buffer.alloc(0));
		decipher2.setAutoPadding(false);
		decipher2.write(encryptedPart1); // first 8 bytes
		decipher2.end(temporary.slice(0, 8)); // last 8 bytes

		const seedBPart1 = this.#xor(decipher2.read(), derivedHalf1.slice(0, 16));
		const seedB = Buffer.concat([seedBPart1, seedBPart2], 24);
		const factorB = BigInteger.fromBuffer(Hash.hash256(seedB));

		// d = passFactor * factorB (mod n)
		const d = passInt.multiply(factorB).mod(secp256k1.n);

		return {
			compressed,
			privateKey: d.toBuffer(32),
		};
	}
}

export const BIP38 = new Implementation();
