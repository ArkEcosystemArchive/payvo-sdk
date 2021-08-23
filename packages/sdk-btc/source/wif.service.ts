import { Exceptions, IoC, Services } from "@payvo/sdk";
import { BIP32 } from "@payvo/cryptography";

@IoC.injectable()
export class WIFService extends Services.AbstractWIFService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.WIFDataTransferObject> {
		try {
			return { wif: BIP32.fromMnemonic(mnemonic, this.configRepository.get("network.constants")).toWIF() };
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}
}
