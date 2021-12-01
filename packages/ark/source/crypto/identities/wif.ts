import { WIF as Base } from "@payvo/sdk-cryptography";

import { Network } from "../interfaces/networks";
import { KeyPair } from "./contracts";
import { getWifFromNetwork } from "./helpers.js";
import { Keys } from "./keys";

export class WIF {
	public static fromPassphrase(passphrase: string, network?: Network): string {
		const { compressed, privateKey }: KeyPair = Keys.fromPassphrase(passphrase);

		return Base.encode({
			version: getWifFromNetwork(network),
			privateKey,
			compressed,
		});
	}

	public static fromKeys(keys: KeyPair, network?: Network): string {
		return Base.encode({
			version: getWifFromNetwork(network),
			privateKey: keys.privateKey,
			compressed: keys.compressed,
		});
	}
}
