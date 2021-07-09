import { Coins, IoC, Services } from "@payvo/sdk";
import { BinTools } from "avalanche";

import { keyPairFromMnemonic, useKeychain } from "./helpers";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		const { child, path } = keyPairFromMnemonic(this.configRepository, mnemonic, options);

		return {
			type: "bip44",
			address: child.getAddressString(),
			path,
		};
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			type: "bip44",
			address: useKeychain(this.configRepository)
				.importKey(BinTools.getInstance().cb58Decode(privateKey))
				.getAddressString(),
		};
	}

	public override async validate(address: string): Promise<boolean> {
		// @TODO: figure out some actual validation
		return true;
	}
}
