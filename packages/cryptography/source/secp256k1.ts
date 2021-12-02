import { secp256k1 as bcrypto } from "bcrypto";
import * as secp from "@noble/secp256k1";

class Secp256k1 {
	public publicKeyCreate(privateKey: Buffer, compressed: boolean): Buffer {
		return secp.getPublicKey(privateKey, compressed);
	}

	public publicKeyVerify(publicKey: Buffer): boolean {
		return bcrypto.publicKeyVerify(publicKey);
	}

	public publicKeyCombine(publicKeys: Buffer[]): Buffer {
		return bcrypto.publicKeyCombine(publicKeys);
	}

	public sign(hash: Buffer, privateKey: Buffer): Buffer {
		return secp.sign(hash, privateKey);
	}

	public verify(hash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
		return secp.verify(hash, signature, publicKey);
	}

	public schnorrSign(hash: Buffer, privateKey: Buffer): Buffer {
		return secp.schnorr.sign(hash, privateKey);
	}

	public schnorrVerify(hash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
		return secp.schnorr.verify(hash, signature, publicKey);
	}
}

export const secp256k1 = new Secp256k1();
