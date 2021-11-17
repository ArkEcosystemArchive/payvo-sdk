import { IoC, Services } from "@payvo/sdk";
import { decodeAddress, encodeAddress, Keyring } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { createKeyMulti } from "@polkadot/util-crypto";
import { strict as assert } from "assert";

import { BindingType } from "./constants.js";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
    @IoC.inject(BindingType.Keyring)
    protected readonly keyring!: Keyring;

    public override async fromMnemonic(
        mnemonic: string,
        options?: Services.IdentityOptions,
    ): Promise<Services.AddressDataTransferObject> {
        return {
            type: "ss58",
            address: this.keyring.addFromMnemonic(mnemonic).address,
        };
    }

    public override async fromMultiSignature({
        min,
        publicKeys,
    }: Services.MultisignatureAddressInput): Promise<Services.AddressDataTransferObject> {
        assert.ok(publicKeys);
        assert.ok(min);

        return {
            type: "ss58",
            address: encodeAddress(createKeyMulti(publicKeys, min), 0),
        };
    }

    public override async validate(address: string): Promise<boolean> {
        try {
            encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

            return true;
        } catch {
            return false;
        }
    }
}
