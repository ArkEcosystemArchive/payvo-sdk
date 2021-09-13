import { Interfaces } from "@arkecosystem/crypto";
import { PrivateKey as BasePrivateKey } from "@arkecosystem/crypto-identities";
import { Exceptions, IoC, Services } from "@payvo/sdk";
import { BIP39 } from "@payvo/cryptography";
import { abort_if, abort_unless } from "@payvo/helpers";

import { BindingType } from "./coin.contract";

@IoC.injectable()
export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	@IoC.inject(BindingType.Crypto)
	private readonly config!: Interfaces.NetworkConfig;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		abort_unless(BIP39.validate(mnemonic), "The given value is not BIP39 compliant.");

		return {
			privateKey: BasePrivateKey.fromPassphrase(mnemonic),
		};
	}

	public override async fromSecret(secret: string): Promise<Services.PrivateKeyDataTransferObject> {
		abort_if(BIP39.validate(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

		return {
			privateKey: BasePrivateKey.fromPassphrase(secret),
		};
	}

	public override async fromWIF(wif: string): Promise<Services.PrivateKeyDataTransferObject> {
		return {
			privateKey: BasePrivateKey.fromWIF(wif, this.config.network),
		};
	}
}
