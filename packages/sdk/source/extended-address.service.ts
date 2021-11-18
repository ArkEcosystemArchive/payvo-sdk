/* istanbul ignore file */

import { NotImplemented } from "../exceptions.js";
import { injectable } from "../ioc/index.js";
import { ExtendedAddressDataTransferObject, ExtendedAddressService } from "./extended-address.contract.js";

@injectable()
export class AbstractExtendedAddressService implements ExtendedAddressService {
	public async fromMnemonic(mnemonic: string, pageSize: number): Promise<ExtendedAddressDataTransferObject[]> {
		throw new NotImplemented(this.constructor.name, this.fromMnemonic.name);
	}

	public async fromPrivateKey(privateKey: string, pageSize: number): Promise<ExtendedAddressDataTransferObject[]> {
		throw new NotImplemented(this.constructor.name, this.fromPrivateKey.name);
	}
}
