import { Exceptions, IoC, Services } from "@payvo/sdk";
import * as bitcoin from "bitcoinjs-lib";

import { BindingType } from "./constants";
import { AddressFactory } from "./address.factory";
import { getNetworkConfig, getNetworkID } from "./config";
import { BIP32 } from "@payvo/cryptography";

@IoC.injectable()
export class AddressService extends Services.AbstractAddressService {
	@IoC.inject(BindingType.AddressFactory)
	protected readonly addressFactory!: AddressFactory;

	#network!: bitcoin.networks.Network;

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#network = getNetworkConfig(this.configRepository);
	}

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		try {
			if (options?.bip44) {
				return this.addressFactory.bip44(mnemonic, options);
			}

			if (options?.bip49) {
				return this.addressFactory.bip49(mnemonic, options);
			}

			if (options?.bip84) {
				return this.addressFactory.bip84(mnemonic, options);
			}

			throw new Error("Please specify a valid derivation method.");
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	public override async fromMultiSignature(
		min: number,
		publicKeys: string[],
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		try {
			let result;

			if (options?.bip44) {
				result = bitcoin.payments.p2sh({
					redeem: bitcoin.payments.p2ms({
						m: min,
						pubkeys: publicKeys.map((publicKey: string) => Buffer.from(publicKey, "hex")),
					}),
					network: this.#network,
				});
			}

			if (options?.bip49) {
				result = bitcoin.payments.p2sh({
					redeem: bitcoin.payments.p2wsh({
						redeem: bitcoin.payments.p2ms({
							m: min,
							pubkeys: publicKeys.map((publicKey: string) => Buffer.from(publicKey, "hex")),
						}),
					}),
					network: this.#network,
				});
			}

			if (options?.bip84) {
				result = bitcoin.payments.p2wsh({
					redeem: bitcoin.payments.p2ms({
						m: min,
						pubkeys: publicKeys.map((publicKey: string) => Buffer.from(publicKey, "hex")),
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
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	public override async fromPublicKey(
		publicKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		try {
			let result;

			let publicKeyBuffer: Buffer = Buffer.from(publicKey, "hex");

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
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return this.fromPublicKey(
			bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, "hex")).publicKey.toString("hex"),
			options,
		);
	}

	public override async fromWIF(
		wif: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		try {
			let result;

			if (options?.bip44) {
				result = bitcoin.payments.p2pkh({
					pubkey: bitcoin.ECPair.fromWIF(wif).publicKey,
					network: this.#network,
				});
			}

			if (options?.bip49) {
				result = bitcoin.payments.p2sh({
					redeem: bitcoin.payments.p2wpkh({ pubkey: bitcoin.ECPair.fromWIF(wif).publicKey }),
					network: this.#network,
				});
			}

			if (options?.bip84) {
				result = bitcoin.payments.p2wpkh({
					pubkey: bitcoin.ECPair.fromWIF(wif).publicKey,
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
		} catch (error) {
			throw new Exceptions.CryptoException(error);
		}
	}

	public override async validate(address: string): Promise<boolean> {
		return address !== undefined;
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
			throw new Error("extended public key must be depth 3 (account level)");
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
