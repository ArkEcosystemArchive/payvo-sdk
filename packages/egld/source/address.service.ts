import { Services } from "@payvo/sdk";
import { bech32 } from "@payvo/sdk-cryptography";

import { makeAccount } from "./factories.js";

export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		const account = makeAccount();
		account.loadFromMnemonic(mnemonic);

		return { type: "bip39", address: account.address() };
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		const account = makeAccount();
		account.loadFromHexPrivateKey(privateKey);

		return { type: "bip39", address: account.address() };
	}

	public override async validate(address: string): Promise<boolean> {
		try {
			bech32.decode(address);

			return true;
		} catch {
			return false;
		}
	}
}
