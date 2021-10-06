import { Exceptions, IoC, Services } from "@payvo/sdk";
import { WIF } from "@payvo/cryptography";
import { getPrivateAndPublicKeyFromPassphrase } from "@liskhq/lisk-cryptography";
import { BIP39 } from "@payvo/cryptography";
import { abort_if, abort_unless } from "@payvo/helpers";

@IoC.injectable()
export class WIFService extends Services.AbstractWIFService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.WIFDataTransferObject> {
		abort_unless(BIP39.compatible(mnemonic), "The given value is not BIP39 compliant.");

		return {
			wif: WIF.encode({
				// Technically this isn't the WIF version but LSK has none.
				version: this.configRepository.get<number>("network.constants.slip44"),
				privateKey: getPrivateAndPublicKeyFromPassphrase(mnemonic).privateKey.toString("hex").slice(0, 64),
				compressed: true,
			}),
		};
	}

	public override async fromPrivateKey(privateKey: string): Promise<Services.WIFDataTransferObject> {
		return {
			wif: WIF.encode({
				// Technically this isn't the WIF version but LSK has none.
				version: this.configRepository.get<number>("network.constants.slip44"),
				privateKey,
				compressed: true,
			}),
		};
	}

	public override async fromSecret(secret: string): Promise<Services.WIFDataTransferObject> {
		abort_if(BIP39.compatible(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

		return {
			wif: WIF.encode({
				// Technically this isn't the WIF version but LSK has none.
				version: this.configRepository.get<number>("network.constants.slip44"),
				privateKey: getPrivateAndPublicKeyFromPassphrase(secret).privateKey.toString("hex").substring(0, 64),
				compressed: true,
			}),
		};
	}
}
