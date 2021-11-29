import { wallet } from "@cityofzion/neon-js";
import { IoC, Services } from "@payvo/sdk";

import { createWallet, deriveWallet } from "./utils.js";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: deriveWallet(
				mnemonic,
				this.configRepository.get<number>("network.constants.slip44"),
				options?.bip44?.account || 0,
				options?.bip44?.change || 0,
				options?.bip44?.addressIndex || 0,
			).address,
		};
	}

	public override async fromPublicKey(
		publicKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: createWallet(publicKey).address,
		};
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: createWallet(privateKey).address,
		};
	}

	public override async fromWIF(wif: string): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: createWallet(wif).address,
		};
	}

	public override async validate(address: string): Promise<boolean> {
		return wallet.isAddress(address);
	}
}
