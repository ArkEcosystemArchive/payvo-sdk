import { BIP32 } from "@payvo/cryptography";
import { IoC, Services } from "@payvo/sdk";
import { getNetworkConfig } from "./config";
import * as bitcoin from "bitcoinjs-lib";

@IoC.injectable()
export class ExtendedPublicKeyService extends Services.AbstractExtendedPublicKeyService {
	#network!: bitcoin.networks.Network;

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#network = getNetworkConfig(this.configRepository);
	}

	public override async fromMnemonic(mnemonic: string, options?: Services.IdentityOptions): Promise<string> {
		let accountKey = BIP32.fromMnemonic(mnemonic, this.#network);

		if (options?.bip44) {
			accountKey = accountKey
				.deriveHardened(44)
				.deriveHardened(this.configRepository.get("network.constants.slip44"))
				.deriveHardened(options?.bip44?.account || 0);
		}

		if (options?.bip49) {
			accountKey = accountKey
				.deriveHardened(49)
				.deriveHardened(this.configRepository.get("network.constants.slip44"))
				.deriveHardened(options?.bip49?.account || 0);
		}

		if (options?.bip84) {
			accountKey = accountKey
				.deriveHardened(84)
				.deriveHardened(this.configRepository.get("network.constants.slip44"))
				.deriveHardened(options?.bip84?.account || 0);
		}

		return accountKey.neutered().toBase58();
	}
}
