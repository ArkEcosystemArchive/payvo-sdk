/* istanbul ignore file */

import { AddressDataTransferObject } from "./address.contract.js";
import { NotImplemented } from "./exceptions.js";
import { IdentityOptions } from "./shared.contract.js";
import { WalletDiscoveryService } from "./wallet-discovery.contract.js";

export class AbstractWalletDiscoveryService implements WalletDiscoveryService {
	public async fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<AddressDataTransferObject[]> {
		throw new NotImplemented(this.constructor.name, this.fromMnemonic.name);
	}
}
