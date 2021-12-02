import { Exceptions, IoC, Services } from "@payvo/sdk";
import Stellar from "stellar-sdk";

import { deriveKeyPair } from "./helpers.js";

export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		const { child, path } = deriveKeyPair(mnemonic, options);

		return {
			publicKey: child.publicKey(),
			privateKey: child.secret(),
			path,
		};
	}

	public override async fromPrivateKey(privateKey: string): Promise<Services.KeyPairDataTransferObject> {
		const source = Stellar.Keypair.fromSecret(privateKey);

		return {
			publicKey: source.publicKey(),
			privateKey: source.secret(),
		};
	}
}
