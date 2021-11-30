import { IoC, Services } from "@payvo/sdk";
import { BIP39 } from "@payvo/sdk-cryptography";
import { abort_if, abort_unless } from "@payvo/sdk-helpers";

import { Keys as BaseKeys } from "./crypto/identities/keys.js";

@IoC.injectable()
export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		abort_unless(BIP39.compatible(mnemonic), "The given value is not BIP39 compliant.");

		const { publicKey, privateKey } = BaseKeys.fromPassphrase(mnemonic, true);

		return { publicKey, privateKey };
	}

	public override async fromSecret(secret: string): Promise<Services.KeyPairDataTransferObject> {
		abort_if(BIP39.compatible(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

		const { publicKey, privateKey } = BaseKeys.fromPassphrase(secret, true);

		return { publicKey, privateKey };
	}

	public override async fromWIF(wif: string): Promise<Services.KeyPairDataTransferObject> {
		const { publicKey, privateKey } = BaseKeys.fromWIF(wif);

		return { publicKey, privateKey };
	}
}
