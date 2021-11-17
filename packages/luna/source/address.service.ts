import { Services } from "@payvo/sdk";

import { deriveKey } from "./helpers.js";

export class AddressService extends Services.AbstractAddressService {
    public override async fromMnemonic(
        mnemonic: string,
        options?: Services.IdentityOptions,
    ): Promise<Services.AddressDataTransferObject> {
        return { type: "bip39", address: deriveKey(mnemonic).accAddress };
    }

    public override async validate(address: string): Promise<boolean> {
        return true;
    }
}
