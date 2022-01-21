import { strict as assert } from "assert";
import { IoC, Services } from "@payvo/sdk";
import { BIP39 } from "@payvo/sdk-cryptography";
import { abort_if, abort_unless } from "@payvo/sdk-helpers";

import { BindingType } from "./coin.contract.js";
import { Address as BaseAddress } from "./crypto/identities/address.js";
import { Keys } from "./crypto/identities/keys.js";
import { Interfaces } from "./crypto/index.js";

export class AddressService extends Services.AbstractAddressService {
	readonly #config!: Interfaces.NetworkConfig;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#config = container.get(BindingType.Crypto);
	}

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		abort_unless(BIP39.compatible(mnemonic), "The given value is not BIP39 compliant.");

		return {
			address: BaseAddress.fromPassphrase(mnemonic, this.#config.network),
			type: "bip39",
		};
	}

	public override async fromMultiSignature({
		min,
		publicKeys,
	}: Services.MultisignatureAddressInput): Promise<Services.AddressDataTransferObject> {
		assert.ok(publicKeys);
		assert.ok(min);

		return {
			address: BaseAddress.fromMultiSignatureAsset({ min, publicKeys }, this.#config.network),
			type: "bip39",
		};
	}

	public override async fromPublicKey(
		publicKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			address: BaseAddress.fromPublicKey(publicKey, this.#config.network),
			type: "bip39",
		};
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			address: BaseAddress.fromPrivateKey(Keys.fromPrivateKey(privateKey), this.#config.network),
			type: "bip39",
		};
	}

	public override async fromSecret(secret: string): Promise<Services.AddressDataTransferObject> {
		abort_if(BIP39.compatible(secret), "The given value is BIP39 compliant. Please use [fromMnemonic] instead.");

		return {
			address: BaseAddress.fromPassphrase(secret, this.#config.network),
			type: "bip39",
		};
	}

	public override async fromWIF(wif: string): Promise<Services.AddressDataTransferObject> {
		return {
			address: BaseAddress.fromWIF(wif, this.#config.network),
			type: "bip39",
		};
	}

	public override async validate(address: string): Promise<boolean> {
		return BaseAddress.validate(address, this.#config.network);
	}
}
