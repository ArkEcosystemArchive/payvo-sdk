import { IoC, Services } from "@payvo/sdk";
import { deriveAddress, derivePublicKey } from "nanocurrency";
import { tools } from "nanocurrency-web";

import { deriveAccount, deriveLegacyAccount } from "./account";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		if (options?.bip44Legacy) {
			return {
				type: "bip44",
				address: deriveLegacyAccount(mnemonic, options?.bip44Legacy?.account).address,
			};
		}

		return {
			type: "bip44",
			address: deriveAccount(mnemonic, options?.bip44?.account).address,
		};
	}

	public override async fromPublicKey(
		publicKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: deriveAddress(publicKey),
		};
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: deriveAddress(derivePublicKey(privateKey)),
		};
	}

	public override async validate(address: string): Promise<boolean> {
		return tools.validateAddress(address);
	}
}
