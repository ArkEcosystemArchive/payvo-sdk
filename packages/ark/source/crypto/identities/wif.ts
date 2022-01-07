import { WIF as Base } from "@payvo/sdk-cryptography";

import { Network } from "../interfaces/networks.js";
import { KeyPair } from "./contracts.js";
import { getWIF } from "./helpers.js";
import { Keys } from "./keys.js";

export class WIF {
	public static fromPassphrase(passphrase: string, network?: Network): string {
		const { compressed, privateKey }: KeyPair = Keys.fromPassphrase(passphrase);

		return Base.encode({
			compressed,
			privateKey,
			version: getWIF(network),
		});
	}

	public static fromKeys(keys: KeyPair, network?: Network): string {
		return Base.encode({
			compressed: keys.compressed,
			privateKey: keys.privateKey,
			version: getWIF(network),
		});
	}
}
