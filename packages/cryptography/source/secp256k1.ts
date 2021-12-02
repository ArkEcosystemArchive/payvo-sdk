import { secp256k1 as bcrypto } from "bcrypto";
import elliptic from "elliptic";

class Secp256k1 {
	readonly #ec: elliptic.ec;

	public constructor() {
		this.#ec = new elliptic.ec("secp256k1");
	}

	public publicKeyCreate(privateKey: Buffer, compressed: boolean): Buffer {
		const publicKey: elliptic.curve.base.BasePoint = this.#ec.keyFromPrivate(privateKey.toString("hex")).getPublic();

		if (compressed) {
			return Buffer.from(publicKey.encodeCompressed("hex"), "hex");
		}

		return Buffer.from(publicKey.encode("hex", true), "hex");
	}

	public publicKeyVerify(publicKey: Buffer): boolean {
		return bcrypto.publicKeyVerify(publicKey);
	}

	public publicKeyCombine(publicKeys: Buffer[]): Buffer {
		return bcrypto.publicKeyCombine(publicKeys);

		// @TODO: this will probably break because it is different than bcrypto schnorr
		// return schnorr.muSig.pubKeyCombine(publicKeys, null);
	}

	// @TODO: remove, this is only used by ATOM
	public sign(hash: Buffer, privateKey: Buffer): Buffer {
		return Buffer.from(this.#ec.keyFromPrivate(privateKey.toString("hex")).sign(hash, "hex", { canonical: true }).toDER());
	}

	// @TODO: remove, this is only used by ATOM
	public verify(hash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
		return this.#ec.keyFromPublic(publicKey).verify(hash, signature);
	}

	public schnorrSign(hash: Buffer, privateKey: Buffer): Buffer {
		return bcrypto.schnorrSign(hash, privateKey);
		// return schnorr.sign(privateKey.toString("hex"), hash);
	}

	public schnorrVerify(hash: Buffer, signature: Buffer, publicKey: Buffer): boolean {
		return bcrypto.schnorrVerify(hash, signature, publicKey);
		// return schnorr.verify(publicKey, hash, signature);
	}
}

export const secp256k1 = new Secp256k1();
