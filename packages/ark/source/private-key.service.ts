import { Interfaces } from "./crypto/index.js";
import { PrivateKey as BasePrivateKey } from "./crypto/identities/private-key.js";
import { IoC, Services } from "@payvo/sdk";
import { BIP39 } from "@payvo/sdk-cryptography";
import { abort_if, abort_unless } from "@payvo/sdk-helpers";

import { BindingType } from "./coin.contract.js";

@IoC.injectable()
export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	@IoC.inject(BindingType.Crypto)
	private readonly config!: Interfaces.NetworkConfig;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		abort_unless(BIP39.compatible(mnemonic), "The given value is not BIP39 compliant.");

		return {
			privateKey: BasePrivateKey.fromPassphrase(mnemonic),
		};
	}

	public override async fromSecret(secret: string): Promise<Services.PrivateKeyDataTransferObject> {
		abort_if(BIP39.compatible(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

		return {
			privateKey: BasePrivateKey.fromPassphrase(secret),
		};
	}

	public override async fromWIF(wif: string): Promise<Services.PrivateKeyDataTransferObject> {
		return {
			privateKey: BasePrivateKey.fromWIF(wif),
		};
	}
}
