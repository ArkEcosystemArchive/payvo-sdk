import { IoC, Services } from "@payvo/sdk";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { validation } from "@zilliqa-js/util";

import { BindingType } from "./constants";
import { accountFromMnemonic, accountFromPrivateKey } from "./zilliqa";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	@IoC.inject(BindingType.Zilliqa)
	private readonly zilliqa!: Zilliqa;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: (await accountFromMnemonic(this.zilliqa, mnemonic, options)).bech32Address,
		};
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: (await accountFromPrivateKey(this.zilliqa, privateKey)).bech32Address,
		};
	}

	public override async validate(address: string): Promise<boolean> {
		if (validation.isBech32(address)) {
			return true;
		}

		return validation.isAddress(address);
	}
}
