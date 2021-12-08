import { Coins, IoC, Services } from "@payvo/sdk";

import { cb58Encode, keyPairFromMnemonic } from "./helpers.js";

export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		const { child, path } = keyPairFromMnemonic(this.configRepository, mnemonic, options);

		return {
			publicKey: cb58Encode(child.getPublicKey()),
			path,
		};
	}
}
