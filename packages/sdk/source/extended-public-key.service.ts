/* istanbul ignore file */

import { ConfigRepository } from "./coins.js";
import { IContainer } from "./container.contracts.js";
import { NotImplemented } from "./exceptions.js";
import { ExtendedPublicKeyService } from "./extended-public-key.contract.js";
import { BindingType } from "./service-provider.contract.js";
import { IdentityOptions } from "./shared.contract.js";

export class AbstractExtendedPublicKeyService implements ExtendedPublicKeyService {
	protected readonly configRepository: ConfigRepository;

	public constructor(container: IContainer) {
		this.configRepository = container.get(BindingType.ConfigRepository);
	}

	public async fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<string> {
		throw new NotImplemented(this.constructor.name, this.fromMnemonic.name);
	}
}
