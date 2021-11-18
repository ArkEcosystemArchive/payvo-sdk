/* istanbul ignore file */

import { ConfigRepository } from "./coins.js";
import { NotImplemented } from "./exceptions.js";
import { inject, injectable } from "./ioc.js";
import { BindingType } from "./service-provider.contract.js";
import { ExtendedPublicKeyService } from "./extended-public-key.contract.js";
import { IdentityOptions } from "./shared.contract.js";

@injectable()
export class AbstractExtendedPublicKeyService implements ExtendedPublicKeyService {
    @inject(BindingType.ConfigRepository)
    protected readonly configRepository!: ConfigRepository;

    public async fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<string> {
        throw new NotImplemented(this.constructor.name, this.fromMnemonic.name);
    }
}
