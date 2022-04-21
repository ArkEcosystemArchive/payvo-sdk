import { Services } from "@payvo/sdk";
import { BinTools } from "avalanche";

import { cb58Encode as callback58Encode, keyPairFromMnemonic, useKeychain } from "./helpers.js";

export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		const { child, path } = keyPairFromMnemonic(this.configRepository, this.hostSelector, mnemonic, options);

		return {
			path,
			privateKey: callback58Encode(child.getPrivateKey()),
			publicKey: callback58Encode(child.getPublicKey()),
		};
	}

	public override async fromPrivateKey(privateKey: string): Promise<Services.KeyPairDataTransferObject> {
		const keyPair = useKeychain(this.configRepository, this.hostSelector).importKey(
			BinTools.getInstance().cb58Decode(privateKey),
		);

		return {
			privateKey: callback58Encode(keyPair.getPrivateKey()),
			publicKey: callback58Encode(keyPair.getPublicKey()),
		};
	}
}
