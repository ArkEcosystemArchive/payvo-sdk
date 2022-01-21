import { ecdsaSign, ecdsaVerify, publicKeyCombine, publicKeyCreate, publicKeyVerify } from "secp256k1";

import { CrossBuffer, toArrayBuffer, toArrayBufferList } from "./internal/buffer-to-uint8array.js";

class Secp256k1 {
	public publicKeyCreate(privateKey: CrossBuffer, compressed: boolean): Buffer {
		return Buffer.from(publicKeyCreate(toArrayBuffer(privateKey), compressed));
	}

	public publicKeyVerify(publicKey: CrossBuffer): boolean {
		try {
			return publicKeyVerify(toArrayBuffer(publicKey));
		} catch {
			return false;
		}
	}

	public publicKeyCombine(publicKeys: CrossBuffer[]): Buffer {
		return Buffer.from(publicKeyCombine(toArrayBufferList(publicKeys)));
	}

	public sign(hash: CrossBuffer, privateKey: CrossBuffer): Buffer {
		return Buffer.from(ecdsaSign(toArrayBuffer(hash), toArrayBuffer(privateKey)).signature);
	}

	public verify(hash: CrossBuffer, signature: CrossBuffer, publicKey: CrossBuffer): boolean {
		return ecdsaVerify(toArrayBuffer(signature), toArrayBuffer(hash), toArrayBuffer(publicKey));
	}
}

export const secp256k1 = new Secp256k1();
