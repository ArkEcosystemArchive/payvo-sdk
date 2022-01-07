import { Base58Check, Hash } from "@payvo/sdk-cryptography";

import { Network } from "../interfaces/networks.js";
import { KeyPair,MultiSignatureAsset } from "./contracts.js";
import { PublicKeyError } from "./errors.js";
import { getPubKeyHash } from "./helpers.js";
import { PublicKey } from "./public-key.js";

export class Address {
	public static fromPassphrase(passphrase: string, network?: Network): string {
		return Address.fromPublicKey(PublicKey.fromPassphrase(passphrase), network);
	}

	public static fromPublicKey(publicKey: string, network?: Network): string {
		if (!PublicKey.verify(publicKey)) {
			throw new PublicKeyError(publicKey);
		}

		const buffer: Buffer = Hash.ripemd160(Buffer.from(publicKey, "hex"));
		const payload: Buffer = Buffer.alloc(21);

		payload.writeUInt8(getPubKeyHash(network), 0);
		buffer.copy(payload, 1);

		return this.fromBuffer(payload);
	}

	public static fromWIF(wif: string, network?: Network): string {
		return Address.fromPublicKey(PublicKey.fromWIF(wif, network), network);
	}

	public static fromMultiSignatureAsset(asset: MultiSignatureAsset, network?: Network): string {
		return this.fromPublicKey(PublicKey.fromMultiSignatureAsset(asset), network);
	}

	public static fromPrivateKey(privateKey: KeyPair, network?: Network): string {
		return Address.fromPublicKey(privateKey.publicKey, network);
	}

	public static fromBuffer(buffer: Buffer): string {
		return Base58Check.encode(buffer);
	}

	public static toBuffer(address: string, network?: Network): Buffer {
		const result: Buffer = Base58Check.decode(address);

		if (result[0] !== getPubKeyHash(network)) {
			throw new Error(`Expected address network byte ${getPubKeyHash(network)}, but got ${result[0]}.`);
		}

		return result;
	}

	public static validate(address: string): boolean {
		try {
			return Base58Check.decode(address)[0] === getPubKeyHash();
		} catch {
			return false;
		}
	}
}
