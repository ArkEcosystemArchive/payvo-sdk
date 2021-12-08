import { Exceptions, IoC, Services } from "@payvo/sdk";
import { getPrivateAndPublicKeyFromPassphrase } from "@liskhq/lisk-cryptography";
import { BIP39 } from "@payvo/sdk-cryptography";
import { abort_if, abort_unless } from "@payvo/sdk-helpers";

export class KeyPairService extends Services.AbstractKeyPairService {
	public override async fromMnemonic(mnemonic: string): Promise<Services.KeyPairDataTransferObject> {
		abort_unless(BIP39.compatible(mnemonic), "The given value is not BIP39 compliant.");

		const { publicKey, privateKey } = getPrivateAndPublicKeyFromPassphrase(mnemonic);

		return {
			publicKey: publicKey.toString("hex"),
			privateKey: privateKey.toString("hex").substring(0, 64),
		};
	}

	public override async fromSecret(secret: string): Promise<Services.KeyPairDataTransferObject> {
		abort_if(BIP39.compatible(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

		const { publicKey, privateKey } = getPrivateAndPublicKeyFromPassphrase(secret);

		return {
			publicKey: publicKey.toString("hex"),
			privateKey: privateKey.toString("hex").substring(0, 64),
		};
	}
}
