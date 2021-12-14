import { Coins, Services } from "@payvo/sdk";
import { bech32, BIP44 } from "@payvo/sdk-cryptography";

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
			address: bech32.encode(this.configRepository.get(Coins.ConfigKey.Bech32), bech32.toWords([...child.identifier])),
			path,
			type: "bip44",
		};
	}

	public override async validate(address: string): Promise<boolean> {
		return true;
	}
}
