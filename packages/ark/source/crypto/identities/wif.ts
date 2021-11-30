import { WIF as Base } from "@payvo/sdk-cryptography";

import { KeyPair } from "./contracts";
import { getWifFromNetwork } from "./helpers.js";
import { Keys } from "./keys";

export class WIF {
	public static fromPassphrase(passphrase: string): string {
		const { compressed, privateKey }: KeyPair = Keys.fromPassphrase(passphrase);

		return Base.encode({
			version: getWifFromNetwork(),
			privateKey,
			compressed,
		});
	}

	public static fromKeys(keys: KeyPair): string {
		return Base.encode({
			version: getWifFromNetwork(),
			privateKey: keys.privateKey,
			compressed: keys.compressed,
		});
	}
}
