/* istanbul ignore file */

import { NotImplemented } from "./exceptions.js";
import { injectable } from "./ioc.js";
import { AddressDataTransferObject } from "./address.contract.js";
import { IdentityOptions } from "./shared.contract.js";
import { WalletDiscoveryService } from "./wallet-discovery.contract.js";

@injectable()
export class AbstractWalletDiscoveryService implements WalletDiscoveryService {
	public async fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<AddressDataTransferObject[]> {
		throw new NotImplemented(this.constructor.name, this.fromMnemonic.name);
	}
}
