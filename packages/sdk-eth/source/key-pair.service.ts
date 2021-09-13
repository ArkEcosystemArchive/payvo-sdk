import { Coins, Exceptions, IoC, Services } from "@payvo/sdk";
import { Buffoon } from "@payvo/cryptography";
import Wallet from "ethereumjs-wallet";

import { createWallet } from "./utils";

@IoC.injectable()
export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		const wallet: Wallet = createWallet(
			mnemonic,
			this.configRepository.get(Coins.ConfigKey.Slip44),
			options?.bip44?.account || 0,
			options?.bip44?.change || 0,
			options?.bip44?.addressIndex || 0,
		);

		return {
			publicKey: wallet.getPublicKey().toString("hex"),
			privateKey: wallet.getPrivateKey().toString("hex"),
		};
	}

	public override async fromPrivateKey(privateKey: string): Promise<Services.KeyPairDataTransferObject> {
		// @ts-ignore
		const wallet: Wallet = new Wallet.default(Buffoon.fromHex(privateKey));

		return {
			publicKey: wallet.getPublicKey().toString("hex"),
			privateKey: wallet.getPrivateKey().toString("hex"),
		};
	}
}
