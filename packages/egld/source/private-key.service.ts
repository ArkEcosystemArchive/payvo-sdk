import { IoC, Services } from "@payvo/sdk";

import { makeAccount } from "./factories.js";

@IoC.injectable()
export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		const account = makeAccount();
		account.loadFromMnemonic(mnemonic);

		return { privateKey: account.privateKeyAsString() };
	}
}
