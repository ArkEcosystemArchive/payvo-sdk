import { Coins, IoC, Services } from "@payvo/sdk";

import { cb58Encode, keyPairFromMnemonic } from "./helpers.js";

export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		const { child, path } = keyPairFromMnemonic(this.configRepository, this.hostSelector, mnemonic, options);

		return {
			privateKey: cb58Encode(child.getPrivateKey()),
			path,
		};
	}
}
