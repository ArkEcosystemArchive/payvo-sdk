import { Services } from "@payvo/sdk";

import { cb58Encode as callback58Encode, keyPairFromMnemonic } from "./helpers.js";

export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		const { child, path } = keyPairFromMnemonic(this.configRepository, this.hostSelector, mnemonic, options);

		return {
			path,
			publicKey: callback58Encode(child.getPublicKey()),
		};
	}
}
