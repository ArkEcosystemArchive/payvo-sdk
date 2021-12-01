import { Hash, secp256k1, WIF } from "@payvo/sdk-cryptography";

import { Network } from "../interfaces/networks";
import { KeyPair } from "./contracts";
import { NetworkVersionError } from "./errors";
import { getWIF } from "./helpers.js";

export class Keys {
    public static fromPassphrase(passphrase: string, compressed = true): KeyPair {
        return Keys.fromPrivateKey(Hash.sha256(Buffer.from(passphrase, "utf8")), compressed);
    }

    public static fromPrivateKey(privateKey: Buffer | string, compressed = true): KeyPair {
        privateKey = privateKey instanceof Buffer ? privateKey : Buffer.from(privateKey, "hex");

        return {
            publicKey: secp256k1.publicKeyCreate(privateKey, compressed).toString("hex"),
            privateKey: privateKey.toString("hex"),
            compressed,
        };
    }

    public static fromWIF(wif: string, network?: Network): KeyPair {
        const { version, compressed, privateKey } = WIF.decode(wif);

        if (version !== getWIF(network)) {
            throw new NetworkVersionError(getWIF(network), version);
        }

        return {
            publicKey: secp256k1.publicKeyCreate(Buffer.from(privateKey, "hex"), compressed).toString("hex"),
            privateKey,
            compressed,
        };
    }
}
