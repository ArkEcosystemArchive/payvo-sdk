import { Coins, Exceptions, IoC, Services } from "@payvo/sdk";

import { deriveWallet } from "./utils.js";

@IoC.injectable()
export class WIFService extends Services.AbstractWIFService {
    public override async fromMnemonic(
        mnemonic: string,
        options?: Services.IdentityOptions,
    ): Promise<Services.WIFDataTransferObject> {
        return {
            wif: deriveWallet(
                mnemonic,
                this.configRepository.get<number>("network.constants.slip44"),
                options?.bip44?.account || 0,
                options?.bip44?.change || 0,
                options?.bip44?.addressIndex || 0,
            ).WIF,
        };
    }
}
