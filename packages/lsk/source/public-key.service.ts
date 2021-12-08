import { Exceptions, IoC, Services } from "@payvo/sdk";
import { getPrivateAndPublicKeyFromPassphrase } from "@liskhq/lisk-cryptography";
import { BIP39 } from "@payvo/sdk-cryptography";
import { abort_if, abort_unless } from "@payvo/sdk-helpers";

export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		abort_unless(BIP39.compatible(mnemonic), "The given value is not BIP39 compliant.");

		return {
			publicKey: getPrivateAndPublicKeyFromPassphrase(mnemonic).publicKey.toString("hex"),
		};
	}

	public override async fromSecret(secret: string): Promise<Services.PublicKeyDataTransferObject> {
		abort_if(BIP39.compatible(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

		return {
			publicKey: getPrivateAndPublicKeyFromPassphrase(secret).publicKey.toString("hex"),
		};
	}
}
