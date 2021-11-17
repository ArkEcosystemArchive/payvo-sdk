/* istanbul ignore file */

import { ConfigRepository } from "../coins/index.js";
import { NotImplemented } from "../exceptions.js";
import { inject, injectable } from "../ioc/index.js";
import { BindingType } from "../ioc/service-provider.contract";
import { ExtendedPublicKeyService } from "./extended-public-key.contract";
import { IdentityOptions } from "./shared.contract";

@injectable()
export class AbstractExtendedPublicKeyService implements ExtendedPublicKeyService {
    @inject(BindingType.ConfigRepository)
    protected readonly configRepository!: ConfigRepository;

    public async fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<string> {
        throw new NotImplemented(this.constructor.name, this.fromMnemonic.name);
    }
}
