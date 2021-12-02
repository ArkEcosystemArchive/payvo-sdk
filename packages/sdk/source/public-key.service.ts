/* istanbul ignore file */

import { ConfigRepository } from "./coins.js";
import { NotImplemented } from "./exceptions.js";

import { BindingType } from "./service-provider.contract.js";
import { PublicKeyDataTransferObject, PublicKeyService } from "./public-key.contract.js";
import { IdentityOptions } from "./shared.contract.js";
import { IContainer } from "./container.contracts.js";

export class AbstractPublicKeyService implements PublicKeyService {
	readonly #configRepository: ConfigRepository;

	public constructor(container: IContainer) {
		this.#configRepository = container.get(BindingType.ConfigRepository);
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
