/* istanbul ignore file */

import { ConfigRepository } from "./coins.js";
import { NotImplemented } from "./exceptions.js";
import { inject, injectable } from "./ioc.js";
import { BindingType } from "./service-provider.contract.js";
import { PrivateKeyDataTransferObject, PrivateKeyService } from "./private-key.contract.js";
import { IdentityOptions } from "./shared.contract.js";

@injectable()
export class AbstractPrivateKeyService implements PrivateKeyService {
	@inject(BindingType.ConfigRepository)
	protected readonly configRepository!: ConfigRepository;

	public async fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<PrivateKeyDataTransferObject> {
		throw new NotImplemented(this.constructor.name, this.fromMnemonic.name);
	}

	public async fromWIF(wif: string): Promise<PrivateKeyDataTransferObject> {
		throw new NotImplemented(this.constructor.name, this.fromWIF.name);
	}

	public async fromSecret(secret: string): Promise<PrivateKeyDataTransferObject> {
		throw new NotImplemented(this.constructor.name, this.fromSecret.name);
	}
}
