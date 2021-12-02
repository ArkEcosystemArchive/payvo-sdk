import { IoC, Services } from "@payvo/sdk";

import { deriveAccount, deriveLegacyAccount } from "./account.js";

export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		if (options?.bip44Legacy) {
			return {
				privateKey: deriveLegacyAccount(mnemonic, options?.bip44Legacy?.account).privateKey,
			};
		}

		return {
			privateKey: deriveAccount(mnemonic, options?.bip44?.account).privateKey,
		};
	}
}
