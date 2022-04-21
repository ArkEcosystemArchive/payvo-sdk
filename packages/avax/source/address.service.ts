import { Services } from "@payvo/sdk";
import { BinTools } from "avalanche";

import { keyPairFromMnemonic, useKeychain, useXChain } from "./helpers.js";

export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		const { child, path } = keyPairFromMnemonic(this.configRepository, this.hostSelector, mnemonic, options);

		return {
			address: child.getAddressString(),
			path,
			type: "bip44",
		};
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			address: useKeychain(this.configRepository, this.hostSelector)
				.importKey(BinTools.getInstance().cb58Decode(privateKey))
				.getAddressString(),
			type: "bip44",
		};
	}

	public override async validate(address: string): Promise<boolean> {
		try {
			return useXChain(this.configRepository, this.hostSelector).parseAddress(address) !== undefined;
		} catch {
			return false;
		}
	}
}
