import { Coins, IoC, Services } from "@payvo/sdk";
import { Buffoon } from "@payvo/sdk-cryptography";
import { ethers } from "ethers";
import web3 from "web3";

import { createWallet } from "./utils.js";

export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: await createWallet(
				mnemonic,
				this.configRepository.get(Coins.ConfigKey.Slip44),
				options?.bip44?.account || 0,
				options?.bip44?.change || 0,
				options?.bip44?.addressIndex || 0,
			).getAddress(),
		};
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: await new ethers.Wallet(privateKey).getAddress(),
		};
	}

	public override async validate(address: string): Promise<boolean> {
		return web3.utils.isAddress(address);
	}
}
