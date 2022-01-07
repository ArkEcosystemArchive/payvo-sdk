import { IoC, Services } from "@payvo/sdk";

import { AddressFactory } from "./address.factory.js";
import { BindingType } from "./constants.js";

export class WalletDiscoveryService extends Services.AbstractWalletDiscoveryService {
	readonly #addressFactory: AddressFactory;

	public constructor(container: IoC.IContainer) {
		super();

		this.#addressFactory = container.get(BindingType.AddressFactory);
	}

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject[]> {
		return Promise.all([
			this.#addressFactory.bip44(mnemonic, options),
			this.#addressFactory.bip49(mnemonic, options),
			this.#addressFactory.bip84(mnemonic, options),
		]);
	}
}
