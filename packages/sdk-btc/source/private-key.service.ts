import { Exceptions, IoC, Services } from "@payvo/sdk";
import { BIP32 } from "@payvo/cryptography";
import { ECPair } from "bitcoinjs-lib";

@IoC.injectable()
export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		return {
			privateKey: BIP32.fromMnemonic(
				mnemonic,
				this.configRepository.get("network.constants"),
			).privateKey!.toString("hex"),
		};
	}

	public override async fromWIF(wif: string): Promise<Services.PrivateKeyDataTransferObject> {
		const { privateKey } = ECPair.fromWIF(wif);

		if (!privateKey) {
			throw new Error(`Failed to derive private key for [${wif}].`);
		}

		return { privateKey: privateKey.toString("hex") };
	}
}
