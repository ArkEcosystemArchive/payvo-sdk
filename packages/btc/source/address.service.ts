import { Exceptions, IoC, Services } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";
import { ECPair } from "ecpair";
import { convertBuffer, convertString } from "@payvo/sdk-helpers";

import { BindingType } from "./constants.js";
import { AddressFactory } from "./address.factory.js";
import { getNetworkConfig, getNetworkID } from "./config.js";
import { BIP32 } from "@payvo/sdk-cryptography";
import { strict as assert } from "assert";

export class AddressService extends Services.AbstractAddressService {
	readonly #addressFactory!: AddressFactory;
	#network!: bitcoin.networks.Network;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#addressFactory = container.get(BindingType.AddressFactory);
		this.#network = getNetworkConfig(this.configRepository);
	}

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		if (options?.bip44) {
			return this.#addressFactory.bip44(mnemonic, options);
		}

		if (options?.bip49) {
			return this.#addressFactory.bip49(mnemonic, options);
		}

		if (options?.bip84) {
			return this.#addressFactory.bip84(mnemonic, options);
		}

		throw new Error("Please specify a valid derivation method.");
	}

	public override async fromMultiSignature(
		{ min, publicKeys }: Services.MultisignatureAddressInput,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		assert.ok(publicKeys);
		assert.ok(min);

		let result;

		if (options?.bip44) {
			result = bitcoin.payments.p2sh({
				redeem: bitcoin.payments.p2ms({
					m: min,
					pubkeys: publicKeys.map(convertString),
				}),
				network: this.#network,
			});
		}

		if (options?.bip49) {
			result = bitcoin.payments.p2sh({
				redeem: bitcoin.payments.p2wsh({
					redeem: bitcoin.payments.p2ms({
						m: min,
						pubkeys: publicKeys.map(convertString),
					}),
				}),
				network: this.#network,
			});
		}

		if (options?.bip84) {
			result = bitcoin.payments.p2wsh({
				redeem: bitcoin.payments.p2ms({
					m: min,
					pubkeys: publicKeys.map(convertString),
				}),
				network: this.#network,
			});
		}

		if (!result) {
			throw new Error("Please specify a valid derivation method.");
		}

		if (!result.address) {
			throw new Error(`Failed to derive address for [${publicKeys}].`);
		}

		return {
			type: this.#derivationMethod(options),
			address: result.address.toString(),
		};
	}

	public override async fromPublicKey(
		publicKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		let result;

		let publicKeyBuffer: Buffer = convertString(publicKey);

		if (publicKey.startsWith("xpub")) {
			if (getNetworkID(this.configRepository) !== "livenet") {
				throw new Error("Usage of a xpub requires livenet to be configured.");
			}

			publicKeyBuffer = this.#deriveBIP32(publicKey, options).publicKey;
		}

		if (publicKey.startsWith("tpub")) {
			if (getNetworkID(this.configRepository) !== "testnet") {
				throw new Error("Usage of a tpub requires testnet to be configured.");
			}

			publicKeyBuffer = this.#deriveBIP32(publicKey, options).publicKey;
		}

		if (options?.bip44) {
			result = bitcoin.payments.p2pkh({
				pubkey: publicKeyBuffer,
				network: this.#network,
			});
		}

		if (options?.bip49) {
			result = bitcoin.payments.p2sh({
				redeem: bitcoin.payments.p2wpkh({ pubkey: publicKeyBuffer }),
				network: this.#network,
			});
		}

		if (options?.bip84) {
			result = bitcoin.payments.p2wpkh({
				pubkey: publicKeyBuffer,
				network: this.#network,
			});
		}

		if (!result) {
			throw new Error("Please specify a valid derivation method.");
		}

		if (!result.address) {
			throw new Error(`Failed to derive address for [${publicKey}].`);
		}

		return {
			type: this.#derivationMethod(options),
			address: result.address.toString(),
		};
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return this.fromPublicKey(convertBuffer(ECPair.fromPrivateKey(convertString(privateKey)).publicKey), options);
	}

	public override async fromWIF(
		wif: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		let result;

		if (options?.bip44) {
			result = bitcoin.payments.p2pkh({
				pubkey: ECPair.fromWIF(wif).publicKey,
				network: this.#network,
			});
		}

		if (options?.bip49) {
			result = bitcoin.payments.p2sh({
				redeem: bitcoin.payments.p2wpkh({ pubkey: ECPair.fromWIF(wif).publicKey }),
				network: this.#network,
			});
		}

		if (options?.bip84) {
			result = bitcoin.payments.p2wpkh({
				pubkey: ECPair.fromWIF(wif).publicKey,
				network: this.#network,
			});
		}

		if (!result) {
			throw new Error("Please specify a valid derivation method.");
		}

		if (!result.address) {
			throw new Error(`Failed to derive address for [${wif}].`);
		}

		return {
			type: this.#derivationMethod(options),
			address: result.address,
		};
	}

	public override async validate(address: string): Promise<boolean> {
		try {
			bitcoin.address.toOutputScript(address, this.#network);

			return true;
		} catch {
			return false;
		}
	}

	#derivationMethod(options?: Services.IdentityOptions) {
		if (options?.bip44) {
			return "bip44";
		}

		if (options?.bip49) {
			return "bip49";
		}

		if (options?.bip84) {
			return "bip84";
		}

		throw new Error("Please specify a valid derivation method.");
	}

	#deriveBIP32(publicKey: string, options?: Services.IdentityOptions) {
		let bip32 = BIP32.fromBase58(publicKey, this.#network);

		if (bip32.depth !== 3) {
			throw new Exceptions.Exception("The depth of the extended public key must equal 3 (account level)");
		}

		if (options?.bip44) {
			return bip32.derive(options?.bip44.change || 0).derive(options?.bip44.addressIndex || 0);
		}

		if (options?.bip49) {
			return bip32.derive(options?.bip49.change || 0).derive(options?.bip49.addressIndex || 0);
		}

		if (options?.bip84) {
			return bip32.derive(options?.bip84.change || 0).derive(options?.bip84.addressIndex || 0);
		}

		throw new Error("Please specify a valid derivation method when attempting BIP32 derivation.");
	}
}
