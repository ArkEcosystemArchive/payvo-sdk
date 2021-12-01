import { secp256k1 as bcrypto } from "bcrypto";

class Secp256k1 {
	public publicKeyCreate(privateKey: Buffer, compressed?: boolean): Buffer {
		return bcrypto.publicKeyCreate(privateKey, compressed);
	}

	public publicKeyVerify(publicKey: Buffer): boolean {
		return bcrypto.publicKeyVerify(publicKey);
	}

	public publicKeyCombine(publicKeys: Buffer[]): Buffer {
		return bcrypto.publicKeyCombine(publicKeys);
	}

	public signatureImport(signature: Buffer): Buffer {
		return bcrypto.signatureImport(signature);
	}

	public signatureExport(signature: Buffer): Buffer {
		return bcrypto.signatureExport(signature);
	}

	public isLowS(signature: Buffer): boolean {
		return bcrypto.isLowS(signature);
	}

	public sign(hash: Buffer, privateKey: Buffer): Buffer {
		return bcrypto.sign(hash, privateKey);
	}

	public verify(hash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
		return bcrypto.verify(hash, signature, publicKey);
	}

	public schnorrSign(hash: Buffer, privateKey: Buffer): Buffer {
		return bcrypto.schnorrSign(hash, privateKey);
	}

	public schnorrVerify(hash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
		return bcrypto.schnorrVerify(hash, signature, publicKey);
	}
}

export const secp256k1 = new Secp256k1();
