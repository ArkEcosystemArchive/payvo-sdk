// Based on https://github.com/simplyhexagonal/string-crypto/blob/main/src/index.ts

import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

class Implementation {
	public async encrypt(value: string, password: string): Promise<string> {
		return AES.encrypt(value, password).toString();
	}

	public async decrypt(hash: string, password: string): Promise<string> {
		return AES.decrypt(hash, password).toString(Utf8);
	}

	public async verify(hash: string, password: string, expected: string): Promise<boolean> {
		try {
			return (await this.decrypt(hash, password)) === expected;
		} catch {
			return false;
		}
	}
}

// @TODO: export as AES
export const PBKDF2 = new Implementation();
