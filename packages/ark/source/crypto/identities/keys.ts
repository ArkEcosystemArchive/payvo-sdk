import { Hash, WIF } from "@payvo/sdk-cryptography";
import { secp256k1 } from "bcrypto";

import { KeyPair } from "./contracts";
import { NetworkVersionError } from "./errors";

export class Keys {
	public static fromPassphrase(passphrase: string, compressed = true): KeyPair {
		return Keys.fromPrivateKey(Hash.sha256(Buffer.from(passphrase, "utf8")), compressed);
	}

	public static fromPrivateKey(privateKey: Buffer | string, compressed = true): KeyPair {
		privateKey = privateKey instanceof Buffer ? privateKey : Buffer.from(privateKey, "hex");

		return {
			publicKey: secp256k1.publicKeyCreate(privateKey, compressed).toString("hex"),
			privateKey: privateKey.toString("hex"),
			compressed,
		};
	}

	public static fromWIF(wif: string, options: { wif: number }): KeyPair {
		const { version, compressed, privateKey } = WIF.decode(wif);

		if (version !== options.wif) {
			throw new NetworkVersionError(options.wif, version);
		}

		return {
			publicKey: secp256k1.publicKeyCreate(Buffer.from(privateKey, "hex"), compressed).toString("hex"),
			privateKey,
			compressed,
		};
	}
}
