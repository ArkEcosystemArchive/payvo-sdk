import { Coins, Exceptions, IoC, Services } from "@payvo/sdk";
import { BIP44 } from "@payvo/cryptography";
import { bech32 } from "bech32";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		const { child, path } = BIP44.deriveChildWithPath(mnemonic, {
			coinType: this.configRepository.get(Coins.ConfigKey.Slip44),
			index: options?.bip44?.addressIndex,
		});

		return {
			type: "bip44",
			address: bech32.encode(this.configRepository.get(Coins.ConfigKey.Bech32), bech32.toWords(child.identifier)),
			path,
		};
	}

	public override async validate(address: string): Promise<boolean> {
		return true;
	}
}
