import { Exceptions, IoC, Services } from "@payvo/sdk";
import { getPrivateAndPublicKeyFromPassphrase } from "@liskhq/lisk-cryptography";
import { BIP39 } from "@payvo/cryptography";
import { abort_if, abort_unless } from "@payvo/helpers";

@IoC.injectable()
export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		try {
			abort_unless(BIP39.validate(mnemonic), "The given value is not BIP39 compliant.");

			const { privateKey } = getPrivateAndPublicKeyFromPassphrase(mnemonic);

			return {
				privateKey: privateKey.toString("hex").substring(0, 64),
			};
		} catch (error) {
			throw new Exceptions.CryptoException(error as any);
		}
	}

	public override async fromSecret(secret: string): Promise<Services.PrivateKeyDataTransferObject> {
		try {
			abort_if(BIP39.validate(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

			const { privateKey } = getPrivateAndPublicKeyFromPassphrase(secret);

			return {
				privateKey: privateKey.toString("hex"),
			};
		} catch (error) {
			throw new Exceptions.CryptoException(error as any);
		}
	}
}
