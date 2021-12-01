import { Exceptions, IoC, Services } from "@payvo/sdk";
import {
	getLisk32AddressFromPassphrase,
	getLisk32AddressFromPublicKey,
	validateBase32Address,
} from "@liskhq/lisk-cryptography";
import { BIP39 } from "@payvo/sdk-cryptography";
import { abort_if, abort_unless } from "@payvo/sdk-helpers";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		abort_unless(BIP39.compatible(mnemonic), "The given value is not BIP39 compliant.");

		return { type: "bip39", address: getLisk32AddressFromPassphrase(mnemonic) };
	}

	public override async fromMultiSignature({
		senderPublicKey,
	}: Services.MultisignatureAddressInput): Promise<Services.AddressDataTransferObject> {
		return {
			type: "lip17",
			address: (await this.fromPublicKey(senderPublicKey!)).address,
		};
	}

	public override async fromPublicKey(
		publicKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return { type: "bip39", address: getLisk32AddressFromPublicKey(Buffer.from(publicKey, "hex")) };
	}

	public override async fromSecret(secret: string): Promise<Services.AddressDataTransferObject> {
		abort_if(BIP39.compatible(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

		return { type: "bip39", address: getLisk32AddressFromPassphrase(secret) };
	}

	public override async validate(address: string): Promise<boolean> {
		try {
			return validateBase32Address(address);
		} catch {
			return false;
		}
	}
}
