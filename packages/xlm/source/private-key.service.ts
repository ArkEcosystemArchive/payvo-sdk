import { Exceptions, IoC, Services } from "@payvo/sdk";

import { deriveKeyPair } from "./helpers.js";

@IoC.injectable()
export class PrivateKeyService extends Services.AbstractPrivateKeyService {
    public override async fromMnemonic(
        mnemonic: string,
        options?: Services.IdentityOptions,
    ): Promise<Services.PrivateKeyDataTransferObject> {
        const { child, path } = deriveKeyPair(mnemonic, options);

        return {
            privateKey: child.secret(),
            path,
        };
    }
}
