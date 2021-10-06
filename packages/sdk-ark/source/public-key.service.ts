import { Interfaces } from "@arkecosystem/crypto";
import { PublicKey as BasePublicKey } from "@arkecosystem/crypto-identities";
import { Exceptions, IoC, Services } from "@payvo/sdk";
import { BIP39 } from "@payvo/cryptography";
import { abort_if, abort_unless } from "@payvo/helpers";

import { BindingType } from "./coin.contract";

@IoC.injectable()
export class PublicKeyService extends Services.AbstractPublicKeyService {
	@IoC.inject(BindingType.Crypto)
	private readonly config!: Interfaces.NetworkConfig;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		abort_unless(BIP39.validate(mnemonic, options?.bip39Locale), "The given value is not BIP39 compliant.");

		return {
			publicKey: BasePublicKey.fromPassphrase(mnemonic),
		};
	}

	public override async fromMultiSignature(
		min: number,
		publicKeys: string[],
	): Promise<Services.PublicKeyDataTransferObject> {
		return {
			publicKey: BasePublicKey.fromMultiSignatureAsset({ min, publicKeys }),
		};
	}

	public override async fromSecret(
		secret: string,
		bip39Locale?: string,
	): Promise<Services.PublicKeyDataTransferObject> {
		abort_if(
			BIP39.validate(secret, bip39Locale),
			"The given value is BIP39 compliant. Please use [fromMnemonic] instead.",
		);

		return {
			publicKey: BasePublicKey.fromPassphrase(secret),
		};
	}

	public override async fromWIF(wif: string): Promise<Services.PublicKeyDataTransferObject> {
		return {
			publicKey: BasePublicKey.fromWIF(wif, this.config.network),
		};
	}
}
