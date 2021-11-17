import { Exceptions, IoC, Services } from "@payvo/sdk";

import { privateToPublic } from "./crypto.js";

@IoC.injectable()
export class PublicKeyService extends Services.AbstractPublicKeyService {
    public override async fromMnemonic(
        mnemonic: string,
        options?: Services.IdentityOptions,
    ): Promise<Services.PublicKeyDataTransferObject> {
        return { publicKey: privateToPublic(mnemonic) };
    }
}
