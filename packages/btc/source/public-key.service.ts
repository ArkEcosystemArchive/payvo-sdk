import { IoC, Services } from "@payvo/sdk";
import { BIP32 } from "@payvo/sdk-cryptography";
import { ECPair } from "ecpair";
import { convertBuffer } from "@payvo/sdk-helpers";

@IoC.injectable()
export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		return {
			publicKey: BIP32.fromMnemonic(mnemonic, this.configRepository.get("network.constants")).publicKey.toString(
				"hex",
			),
		};
	}

	public override async fromWIF(wif: string): Promise<Services.PublicKeyDataTransferObject> {
		return {
			publicKey: convertBuffer(ECPair.fromWIF(wif).publicKey),
		};
	}
}
