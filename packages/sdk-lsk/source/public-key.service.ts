import { Exceptions, IoC, Services } from "@payvo/sdk";
import { getPrivateAndPublicKeyFromPassphrase } from "@liskhq/lisk-cryptography";
import { BIP39 } from "@payvo/cryptography";
import { abort_if, abort_unless } from "@payvo/helpers";

@IoC.injectable()
export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		abort_unless(BIP39.validate(mnemonic, options?.bip39Locale), "The given value is not BIP39 compliant.");

		return {
			publicKey: getPrivateAndPublicKeyFromPassphrase(mnemonic).publicKey.toString("hex"),
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
			publicKey: getPrivateAndPublicKeyFromPassphrase(secret).publicKey.toString("hex"),
		};
	}
}
