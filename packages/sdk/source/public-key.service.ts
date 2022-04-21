/* istanbul ignore file */

import { ConfigRepository } from "./coins.js";
import { IContainer } from "./container.contracts.js";
import { NotImplemented } from "./exceptions.js";
import { NetworkHostSelector } from "./network.models.js";
import { PublicKeyDataTransferObject, PublicKeyService } from "./public-key.contract.js";
import { BindingType } from "./service-provider.contract.js";
import { IdentityOptions } from "./shared.contract.js";

export class AbstractPublicKeyService implements PublicKeyService {
	protected readonly configRepository: ConfigRepository;
	protected readonly hostSelector: NetworkHostSelector;

	public constructor(container: IContainer) {
		this.configRepository = container.get(BindingType.ConfigRepository);
		this.hostSelector = container.get(BindingType.NetworkHostSelector);
	}

	public async fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<PublicKeyDataTransferObject> {
		throw new NotImplemented(this.constructor.name, this.fromMultiSignature.name);
	}

	public async fromMultiSignature(min: number, publicKeys: string[]): Promise<PublicKeyDataTransferObject> {
		throw new NotImplemented(this.constructor.name, this.fromMultiSignature.name);
	}

	public async fromWIF(wif: string): Promise<PublicKeyDataTransferObject> {
		throw new NotImplemented(this.constructor.name, this.fromWIF.name);
	}

	public async fromSecret(secret: string): Promise<PublicKeyDataTransferObject> {
		throw new NotImplemented(this.constructor.name, this.fromSecret.name);
	}
}
