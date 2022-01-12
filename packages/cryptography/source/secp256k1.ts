import { ecdsaSign, ecdsaVerify,publicKeyCombine, publicKeyCreate, publicKeyVerify } from "secp256k1";

import { toArrayBuffer, toArrayBufferList } from "./internal/buffer-to-uint8array.js";

class Secp256k1 {
	public publicKeyCreate(privateKey: Buffer, compressed: boolean): Buffer {
		return Buffer.from(publicKeyCreate(toArrayBuffer(privateKey), toArrayBuffer(compressed)));
	}

	public publicKeyVerify(publicKey: Buffer): boolean {
		try {
			return publicKeyVerify(toArrayBuffer(publicKey));
		} catch {
			return false;
		}
	}

	public publicKeyCombine(publicKeys: Buffer[]): Buffer {
		return Buffer.from(publicKeyCombine(toArrayBufferList(publicKeys)));
	}

	public sign(hash: Buffer, privateKey: Buffer): Buffer {
		return Buffer.from(ecdsaSign(toArrayBuffer(hash), toArrayBuffer(privateKey)).signature);
	}

	public verify(hash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
		return ecdsaVerify(toArrayBuffer(signature), toArrayBuffer(hash), toArrayBuffer(publicKey));
	}
}

export const secp256k1 = new Secp256k1();
