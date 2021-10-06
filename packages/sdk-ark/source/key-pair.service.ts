import { Interfaces } from "@arkecosystem/crypto";
import { Keys as BaseKeys } from "@arkecosystem/crypto-identities";
import { Exceptions, IoC, Services } from "@payvo/sdk";
import { BIP39 } from "@payvo/cryptography";
import { abort_if, abort_unless } from "@payvo/helpers";

import { BindingType } from "./coin.contract";

@IoC.injectable()
export class KeyPairService extends Services.AbstractKeyPairService {
	@IoC.inject(BindingType.Crypto)
	private readonly config!: Interfaces.NetworkConfig;

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
		const { publicKey, privateKey } = BaseKeys.fromWIF(wif, this.config.network);

		return { publicKey, privateKey };
	}
}
