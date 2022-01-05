import { Coins, IoC, Services } from "@payvo/sdk";
import { ethers } from "ethers";

import { createWallet } from "./utils.js";

export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		const wallet: ethers.Wallet = createWallet(
			mnemonic,
			this.configRepository.get(Coins.ConfigKey.Slip44),
			options?.bip44?.account || 0,
			options?.bip44?.change || 0,
			options?.bip44?.addressIndex || 0,
		);

		return {
			publicKey: wallet.publicKey,
			privateKey: wallet.privateKey,
		};
	}

	public override async fromPrivateKey(privateKey: string): Promise<Services.KeyPairDataTransferObject> {
		const wallet: ethers.Wallet = new ethers.Wallet(privateKey);

		return {
			publicKey: wallet.publicKey,
			privateKey: wallet.privateKey,
		};
	}
}
