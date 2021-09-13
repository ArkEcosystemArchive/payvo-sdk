import { Coins, Exceptions, IoC, Services } from "@payvo/sdk";

import { createWallet, deriveWallet } from "./utils";

@IoC.injectable()
export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		return {
			privateKey: deriveWallet(
				mnemonic,
				this.configRepository.get<number>("network.constants.slip44"),
				options?.bip44?.account || 0,
				options?.bip44?.change || 0,
				options?.bip44?.addressIndex || 0,
			).privateKey,
		};
	}

	public override async fromWIF(wif: string): Promise<Services.PrivateKeyDataTransferObject> {
		return {
			privateKey: createWallet(wif).privateKey,
		};
	}
}
