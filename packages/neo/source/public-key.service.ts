import { Coins, Exceptions, IoC, Services } from "@payvo/sdk";

import { createWallet, deriveWallet } from "./utils.js";

@IoC.injectable()
export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		return {
			publicKey: deriveWallet(
				mnemonic,
				this.configRepository.get<number>("network.constants.slip44"),
				options?.bip44?.account || 0,
				options?.bip44?.change || 0,
				options?.bip44?.addressIndex || 0,
			).publicKey,
		};
	}

	public override async fromWIF(wif: string): Promise<Services.PublicKeyDataTransferObject> {
		return {
			publicKey: createWallet(wif).publicKey,
		};
	}
}
