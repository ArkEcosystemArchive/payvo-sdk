import { Coins, IoC, Services } from "@payvo/sdk";

import { AddressFactory } from "./address.factory";
import { BindingType } from "./constants";

@IoC.injectable()
export class WalletDiscoveryService extends Services.AbstractWalletDiscoveryService {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	protected readonly configRepository!: Coins.ConfigRepository;

	@IoC.inject(BindingType.AddressFactory)
	protected readonly addressFactory!: AddressFactory;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject[]> {
		return Promise.all([
			this.addressFactory.bip39(mnemonic, options),
			this.addressFactory.bip44(mnemonic, options),
			this.addressFactory.bip49(mnemonic, options),
			this.addressFactory.bip84(mnemonic, options),
		]);
	}
}
