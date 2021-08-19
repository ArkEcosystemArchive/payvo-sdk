import { BIP32 } from "@payvo/cryptography";
import { IoC, Services } from "@payvo/sdk";

@IoC.injectable()
export class ExtendedPublicKeyService extends Services.AbstractExtendedPublicKeyService {
	public override async fromMnemonic(mnemonic: string, options?: Services.IdentityOptions): Promise<string> {
		let bip32 = BIP32.fromMnemonic(mnemonic);

		if (options?.bip44) {
			bip32 = bip32
				.deriveHardened(44)
				.deriveHardened(this.configRepository.get("network.constants.slip44"))
				.deriveHardened(options?.bip44?.account || 0);
		}

		if (options?.bip49) {
			bip32 = bip32
				.deriveHardened(49)
				.deriveHardened(this.configRepository.get("network.constants.slip44"))
				.deriveHardened(options?.bip49?.account || 0);
		}

		if (options?.bip84) {
			bip32 = bip32
				.deriveHardened(84)
				.deriveHardened(this.configRepository.get("network.constants.slip44"))
				.deriveHardened(options?.bip84?.account || 0);
		}

		return bip32.neutered().toBase58();
	}
}
