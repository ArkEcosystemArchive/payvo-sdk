import { Exceptions, IoC, Services } from "@payvo/sdk";
import {
	getLisk32AddressFromPassphrase,
	getLisk32AddressFromPublicKey,
	validateBase32Address,
} from "@liskhq/lisk-cryptography";
import { BIP39 } from "@payvo/cryptography";
import { abort_if, abort_unless } from "@payvo/helpers";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		try {
			abort_unless(BIP39.validate(mnemonic), "The given value is not BIP39 compliant.");

			return { type: "bip39", address: getLisk32AddressFromPassphrase(mnemonic) };
		} catch (error) {
			throw new Exceptions.CryptoException(error as any);
		}
	}

	public override async fromPublicKey(
		publicKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		try {
			return { type: "bip39", address: getLisk32AddressFromPublicKey(Buffer.from(publicKey, "hex")) };
		} catch (error) {
			throw new Exceptions.CryptoException(error as any);
		}
	}

	public override async fromSecret(secret: string): Promise<Services.AddressDataTransferObject> {
		try {
			abort_if(BIP39.validate(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

			return { type: "bip39", address: getLisk32AddressFromPassphrase(secret) };
		} catch (error) {
			throw new Exceptions.CryptoException(error as any);
		}
	}

	public override async validate(address: string): Promise<boolean> {
		try {
			return validateBase32Address(address);
		} catch {
			return false;
		}
	}
}
