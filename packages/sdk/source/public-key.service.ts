/* istanbul ignore file */

import { ConfigRepository } from "../coins/index.js";
import { NotImplemented } from "../exceptions.js";
import { inject, injectable } from "../ioc/index.js";
import { BindingType } from "../ioc/service-provider.contract.js";
import { PublicKeyDataTransferObject, PublicKeyService } from "./public-key.contract.js";
import { IdentityOptions } from "./shared.contract.js";

@injectable()
export class AbstractPublicKeyService implements PublicKeyService {
	@inject(BindingType.ConfigRepository)
	protected readonly configRepository!: ConfigRepository;

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
