import { Exceptions, IoC, Services } from "@payvo/sdk";

import { deriveAccount, deriveLegacyAccount } from "./account";

@IoC.injectable()
export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		if (options?.bip44Legacy) {
			const { publicKey, privateKey } = deriveLegacyAccount(mnemonic, options?.bip44Legacy?.account);

			return { publicKey, privateKey };
		}

		const { publicKey, privateKey } = deriveAccount(mnemonic, options?.bip44?.account);

		return { publicKey, privateKey };
	}
}
