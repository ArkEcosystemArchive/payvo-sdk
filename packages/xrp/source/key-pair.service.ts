import { Coins, Exceptions, IoC, Services } from "@payvo/sdk";
import { BIP44 } from "@payvo/sdk-cryptography";
import { deriveKeypair } from "ripple-keypairs";

export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		const { child, path } = BIP44.deriveChildWithPath(mnemonic, {
			coinType: this.configRepository.get(Coins.ConfigKey.Slip44),
			index: options?.bip44?.addressIndex,
		});

		return {
			publicKey: child.publicKey.toString("hex"),
			privateKey: child.privateKey!.toString("hex"),
			path,
		};
	}

	public override async fromSecret(secret: string): Promise<Services.KeyPairDataTransferObject> {
		return deriveKeypair(secret);
	}
}
