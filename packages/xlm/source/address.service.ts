import { Exceptions, IoC, Services } from "@payvo/sdk";
import Stellar from "stellar-sdk";

import { buildPath, deriveKeyPair } from "./helpers.js";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
    public override async fromMnemonic(
        mnemonic: string,
        options?: Services.IdentityOptions,
    ): Promise<Services.AddressDataTransferObject> {
        const { child, path } = deriveKeyPair(mnemonic, options);

        return {
            type: "bip44",
            address: child.publicKey(),
            path,
        };
    }

    public override async fromPrivateKey(
        privateKey: string,
        options?: Services.IdentityOptions,
    ): Promise<Services.AddressDataTransferObject> {
        return {
            type: "bip44",
            address: Stellar.Keypair.fromSecret(privateKey).publicKey(),
            path: buildPath(options),
        };
    }

    public override async validate(address: string): Promise<boolean> {
        return Stellar.StrKey.isValidEd25519PublicKey(address);
    }
}
