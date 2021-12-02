import { Coins, IoC, Services } from "@payvo/sdk";
import { BIP44, secp256k1 } from "@payvo/sdk-cryptography";

@IoC.injectable()
export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		const { child, path } = BIP44.deriveChildWithPath(mnemonic, {
			coinType: this.configRepository.get(Coins.ConfigKey.Slip44),
			index: options?.bip44?.addressIndex,
		});

		if (!child.privateKey) {
			throw new Error("Failed to derive private key.");
		}

		return {
			path,
			privateKey: child.privateKey.toString("hex"),
			publicKey: secp256k1.publicKeyCreate(child.privateKey, true).toString("hex"),
		};
	}
}
