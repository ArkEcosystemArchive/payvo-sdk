import { IoC, Services } from "@payvo/sdk";

import { makeAccount } from "./factories.js";

export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		const account = makeAccount();
		account.loadFromMnemonic(mnemonic);

		return { publicKey: account.publicKeyAsString() };
	}
}
