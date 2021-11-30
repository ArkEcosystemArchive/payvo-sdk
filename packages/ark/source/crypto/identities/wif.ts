import { WIF as Base } from "@payvo/sdk-cryptography";

import { KeyPair } from "./contracts";
import { Keys } from "./keys";

export class WIF {
	public static fromPassphrase(passphrase: string, options: { wif: number }): string {
		const { compressed, privateKey }: KeyPair = Keys.fromPassphrase(passphrase);

		return Base.encode({
			version: options.wif,
			privateKey,
			compressed
		});
	}

	public static fromKeys(keys: KeyPair, options: { wif: number }): string {
		return Base.encode({
			version: options.wif,
			privateKey: keys.privateKey,
			compressed: keys.compressed,
		});
	}
}
