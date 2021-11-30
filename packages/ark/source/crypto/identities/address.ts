import { Base58Check, Hash } from "@payvo/sdk-cryptography";

import { MultiSignatureAsset, KeyPair } from "./contracts";
import { PublicKeyError } from "./errors";
import { getPubKeyHash } from "./helpers.js";
import { PublicKey } from "./public-key";

export class Address {
	public static fromPassphrase(passphrase: string): string {
		return Address.fromPublicKey(PublicKey.fromPassphrase(passphrase));
	}

	public static fromPublicKey(publicKey: string): string {
		if (!PublicKey.verify(publicKey)) {
			throw new PublicKeyError(publicKey);
		}

		const buffer: Buffer = Hash.ripemd160(Buffer.from(publicKey, "hex"));
		const payload: Buffer = Buffer.alloc(21);

		payload.writeUInt8(getPubKeyHash(), 0);
		buffer.copy(payload, 1);

		return this.fromBuffer(payload);
	}

	public static fromWIF(wif: string): string {
		return Address.fromPublicKey(PublicKey.fromWIF(wif));
	}

	public static fromMultiSignatureAsset(asset: MultiSignatureAsset): string {
		return this.fromPublicKey(PublicKey.fromMultiSignatureAsset(asset));
	}

	public static fromPrivateKey(privateKey: KeyPair): string {
		return Address.fromPublicKey(privateKey.publicKey);
	}

	public static fromBuffer(buffer: Buffer): string {
		return Base58Check.encode(buffer);
	}

	public static toBuffer(
		address: string,
	): { addressBuffer: Buffer; addressError?: string } {
		const buffer: Buffer = Base58Check.decode(address);
		const result: { addressBuffer: Buffer; addressError?: string } = {
			addressBuffer: buffer,
		};

		if (buffer[0] !== getPubKeyHash()) {
			result.addressError = `Expected address network byte ${getPubKeyHash()}, but got ${buffer[0]}.`;
		}

		return result;
	}

	public static validate(address: string): boolean {
		try {
			return Base58Check.decode(address)[0] === getPubKeyHash();
		} catch (err) {
			return false;
		}
	}
}
