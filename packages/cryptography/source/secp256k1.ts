import { secp256k1 as bcrypto } from "bcrypto";
import * as secp from "secp256k1";

class Secp256k1 {
	public publicKeyCreate(privateKey: Buffer, compressed: boolean): Buffer {
		return Buffer.from(secp.publicKeyCreate(privateKey, compressed));
	}

	public publicKeyVerify(publicKey: Buffer): boolean {
		return secp.publicKeyVerify(publicKey);
	}

	public publicKeyCombine(publicKeys: Buffer[]): Buffer {
		return Buffer.from(secp.publicKeyCombine(publicKeys));
	}

	public sign(hash: Buffer, privateKey: Buffer): Buffer {
		return bcrypto.ecdsaSign(hash, privateKey);
	}

	public verify(hash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
		return bcrypto.ecdsaVerify(signature, hash, publicKey);
	}

	public schnorrSign(hash: Buffer, privateKey: Buffer): Buffer {
		return bcrypto.schnorrSign(hash, privateKey);
	}

	public schnorrVerify(hash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
		return bcrypto.schnorrVerify(hash, signature, publicKey);
	}
}

export const secp256k1 = new Secp256k1();
