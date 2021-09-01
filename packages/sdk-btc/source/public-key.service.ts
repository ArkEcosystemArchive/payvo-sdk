import { Exceptions, IoC, Services } from "@payvo/sdk";
import { BIP32 } from "@payvo/cryptography";
import { ECPair } from "bitcoinjs-lib";

@IoC.injectable()
export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		try {
			return {
				publicKey: BIP32.fromMnemonic(
					mnemonic,
					this.configRepository.get("network.constants"),
				).publicKey.toString("hex"),
			};
		} catch (error) {
			throw new Exceptions.CryptoException(error as any);
		}
	}

	public override async fromWIF(wif: string): Promise<Services.PublicKeyDataTransferObject> {
		try {
			return {
				publicKey: ECPair.fromWIF(wif).publicKey.toString("hex"),
			};
		} catch (error) {
			throw new Exceptions.CryptoException(error as any);
		}
	}
}
