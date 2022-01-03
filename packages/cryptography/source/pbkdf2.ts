// Based on https://github.com/simplyhexagonal/string-crypto/blob/main/src/index.ts

import { Crypto } from "@peculiar/webcrypto";

// @TODO: use UINT8 instead of Buffer
class Implementation {
	readonly #crypto: Crypto = new Crypto();

	public async encrypt(value: string, password: string): Promise<string> {
		const iv: Uint32Array = this.#crypto.getRandomValues(new Uint32Array(16));

		return `${Buffer.from(iv).toString("hex")}:${Buffer.from(
			await this.#crypto.subtle.encrypt(
				{
					iv,
					name: "AES-GCM",
				},
				await this.#crypto.subtle.deriveKey(
					{
						hash: "SHA-512",
						iterations: 100_000,
						name: "PBKDF2",
						salt: this.#getSalt(password),
					},
					await this.#importKey(password),
					{ length: 256, name: "AES-GCM" },
					true,
					["encrypt", "decrypt"],
				),
				Buffer.from(value),
			),
		).toString("hex")}`;
	}

	public async decrypt(hash: string, password: string): Promise<string> {
		return new TextDecoder().decode(
			await this.#crypto.subtle.decrypt(
				{
					iv: Buffer.from(hash.split(":")[0], "hex"),
					name: "AES-GCM",
				},
				await this.#deriveKey(await this.#importKey(password), this.#getSalt(password)),
				Buffer.from(hash.split(":")[1], "hex"),
			),
		);
	}

	public async verify(hash: string, password: string): Promise<boolean> {
		try {
			await this.decrypt(hash, password);

			return true;
		} catch {
			return false;
		}
	}

	async #importKey(password: string): Promise<CryptoKey> {
		return this.#crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, [
			"deriveBits",
			"deriveKey",
		]);
	}

	#getSalt(password: string): Buffer {
		return Buffer.from(`PBKDF2${password}`.normalize("NFKD"));
	}

	async #deriveKey(keyMaterial: CryptoKey, salt: Buffer): Promise<CryptoKey> {
		return this.#crypto.subtle.deriveKey(
			{
				hash: "SHA-512",
				iterations: 100_000,
				name: "PBKDF2",
				salt,
			},
			keyMaterial,
			{ length: 256, name: "AES-GCM" },
			true,
			["encrypt", "decrypt"],
		);
	}
}

// @TODO: export as AES
export const PBKDF2 = new Implementation();
