import { IoC, Services } from "@payvo/sdk";
import { BIP32 } from "@payvo/sdk-cryptography";
import { ECPair } from "ecpair";
import { convertBuffer } from "@payvo/sdk-helpers";

export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		return {
			privateKey: convertBuffer(
				BIP32.fromMnemonic(mnemonic, this.configRepository.get("network.constants")).privateKey!,
			),
		};
	}

	public override async fromWIF(wif: string): Promise<Services.PrivateKeyDataTransferObject> {
		const { privateKey } = ECPair.fromWIF(wif);

		if (!privateKey) {
			throw new Error(`Failed to derive private key for [${wif}].`);
		}

		return { privateKey: convertBuffer(privateKey) };
	}
}
