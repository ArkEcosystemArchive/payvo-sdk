import { secp256k1 } from "@payvo/sdk-cryptography";
import { numberToHex } from "@payvo/sdk-helpers";

import { Network } from "../interfaces/networks.js";
import { MultiSignatureAsset } from "./contracts.js";
import { InvalidMultiSignatureAssetError, PublicKeyError } from "./errors.js";
import { Keys } from "./keys.js";

export class PublicKey {
	public static fromPassphrase(passphrase: string): string {
		return Keys.fromPassphrase(passphrase).publicKey;
	}

	public static fromWIF(wif: string, network?: Network): string {
		return Keys.fromWIF(wif, network).publicKey;
	}

	public static fromMultiSignatureAsset(asset: MultiSignatureAsset): string {
		const { min, publicKeys }: MultiSignatureAsset = asset;

		for (const publicKey of publicKeys) {
			if (!this.verify(publicKey)) {
				throw new PublicKeyError(publicKey);
			}
		}

		if (min < 1 || min > publicKeys.length) {
			throw new InvalidMultiSignatureAssetError();
		}

		const minKey: string = PublicKey.fromPassphrase(numberToHex(min));
		const keys: string[] = [minKey, ...publicKeys];

		return secp256k1
			.publicKeyCombine(keys.map((publicKey: string) => Buffer.from(publicKey, "hex")))
			.toString("hex");
	}

	public static verify(publicKey: string): boolean {
		return secp256k1.publicKeyVerify(Buffer.from(publicKey, "hex"));
	}
}
