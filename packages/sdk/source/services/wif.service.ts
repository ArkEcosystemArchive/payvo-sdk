/* istanbul ignore file */

import { ConfigRepository } from "../coins/index.js";
import { NotImplemented } from "../exceptions.js";
import { inject, injectable } from "../ioc/index.js";
import { BindingType } from "../ioc/service-provider.contract";
import { IdentityOptions } from "./shared.contract";
import { WIFDataTransferObject, WIFService } from "./wif.contract";

@injectable()
export class AbstractWIFService implements WIFService {
    @inject(BindingType.ConfigRepository)
    protected readonly configRepository!: ConfigRepository;

    public async fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<WIFDataTransferObject> {
        throw new NotImplemented(this.constructor.name, this.fromPrivateKey.name);
    }

    public async fromPrivateKey(privateKey: string): Promise<WIFDataTransferObject> {
        throw new NotImplemented(this.constructor.name, this.fromPrivateKey.name);
    }

    public async fromSecret(secret: string): Promise<WIFDataTransferObject> {
        throw new NotImplemented(this.constructor.name, this.fromSecret.name);
    }
}
