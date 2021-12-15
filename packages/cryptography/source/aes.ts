// Based on https://github.com/simplyhexagonal/string-crypto/blob/main/src/index.ts

import { pbkdf2 } from "@noble/hashes/lib/pbkdf2";
import { sha512 } from "@noble/hashes/lib/sha512";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export class AES {
	public static encrypt(value: string, password: string): string {
		const derivedKey = this.#deriveKey(password);

		const randomInitVector = randomBytes(16);

		const aesCBC = createCipheriv("aes-256-gcm", derivedKey, randomInitVector);

		let encryptedBase64 = aesCBC.update(value.toString(), "utf8", "base64");
		encryptedBase64 += aesCBC.final("base64");

		const encryptedHex = Buffer.from(encryptedBase64).toString("hex");

		const initVectorHex = randomInitVector.toString("hex");

		return `${initVectorHex}:${encryptedHex}`;
	}

	public static decrypt(hash: string, password: string): string {
		const derivedKey = this.#deriveKey(password);

		const encryptedParts: string[] = hash.toString().split(":");

		if (encryptedParts.length !== 2) {
			throw new Error(`Incorrect format for encrypted string: ${hash}`);
		}

		const [initVectorHex, encryptedHex] = encryptedParts;

		const randomInitVector = Buffer.from(initVectorHex, "hex");

		const encryptedBase64 = Buffer.from(encryptedHex, "hex").toString();

		const aesCBC = createDecipheriv("aes-256-gcm", derivedKey, randomInitVector);

		return aesCBC.update(encryptedBase64, "base64").toString();
	}

	public static verify(hash: string, password: string): boolean {
		try {
			this.decrypt(hash, password);

			return true;
		} catch {
			return false;
		}
	}

	static #deriveKey(password: string): Uint8Array {
		const nfkd = (password: string) => password.normalize("NFKD");
		const salt = (password: string) => nfkd(`PBKDF2${password}`);

		return pbkdf2(sha512, nfkd(password), salt(password), {
			c: 2048,
			dkLen: 32,
		});
	}
}
