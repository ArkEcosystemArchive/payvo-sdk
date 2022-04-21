import { Coins, Exceptions, Http, IoC, Networks, Services } from "@payvo/sdk";
import { BIP32Interface, BIP44 } from "@payvo/sdk-cryptography";
import * as bitcoin from "bitcoinjs-lib";

import { getNetworkConfig } from "./config.js";
import { BipLevel, Levels } from "./contracts.js";
import MusigWalletDataHelper from "./musig-wallet-data-helper.js";
import WalletDataHelper from "./wallet-data-helper.js";

export class AddressFactory {
	readonly #configRepository: Coins.ConfigRepository;
	readonly #httpClient: Http.HttpClient;
	readonly #hostSelector: Networks.NetworkHostSelector;
	readonly #network: bitcoin.networks.Network;

	public constructor(container: IoC.IContainer) {
		this.#configRepository = container.get(IoC.BindingType.ConfigRepository);
		this.#httpClient = container.get(IoC.BindingType.HttpClient);
		this.#hostSelector = container.get(IoC.BindingType.NetworkHostSelector);
		this.#network = getNetworkConfig(this.#configRepository);
	}

	public getLevel(options?: Services.IdentityOptions): Levels {
		if (options?.bip44) {
			return {
				account: options?.bip44?.account,
				change: options?.bip44?.change,
				coinType: this.#configRepository.get(Coins.ConfigKey.Slip44),
				index: options?.bip44?.addressIndex,
				purpose: 44,
			};
		}

		if (options?.bip49) {
			return {
				account: options?.bip49?.account,
				change: options?.bip49?.change,
				coinType: this.#configRepository.get(Coins.ConfigKey.Slip44),
				index: options?.bip49?.addressIndex,
				purpose: 49,
			};
		}

		if (options?.bip84) {
			return {
				account: options?.bip84?.account,
				change: options?.bip84?.change,
				coinType: this.#configRepository.get(Coins.ConfigKey.Slip44),
				index: options?.bip84?.addressIndex,
				purpose: 84,
			};
		}

		throw new Exceptions.Exception("Unable to determine level");
	}

	public bip44(mnemonic: string, options?: Services.IdentityOptions): Services.AddressDataTransferObject {
		const levels: Levels = {
			account: options?.bip44?.account,
			change: options?.bip44?.change,
			coinType: this.#configRepository.get(Coins.ConfigKey.Slip44),
			index: options?.bip44?.addressIndex,
			purpose: 44,
		};

		return this.#derive(
			"bip44",
			levels,
			bitcoin.payments.p2pkh({
				network: this.#network,
				pubkey: BIP44.deriveChild(mnemonic, levels).publicKey,
			}),
		);
	}

	public bip49(mnemonic: string, options?: Services.IdentityOptions): Services.AddressDataTransferObject {
		const levels: Levels = {
			account: options?.bip49?.account,
			change: options?.bip49?.change,
			coinType: this.#configRepository.get(Coins.ConfigKey.Slip44),
			index: options?.bip49?.addressIndex,
			purpose: 49,
		};

		return this.#derive(
			"bip49",
			levels,
			bitcoin.payments.p2sh({
				network: this.#network,
				redeem: bitcoin.payments.p2wpkh({
					network: this.#network,
					pubkey: BIP44.deriveChild(mnemonic, levels).publicKey,
				}),
			}),
		);
	}

	public bip84(mnemonic: string, options?: Services.IdentityOptions): Services.AddressDataTransferObject {
		const levels: Levels = {
			account: options?.bip84?.account,
			change: options?.bip84?.change,
			coinType: this.#configRepository.get(Coins.ConfigKey.Slip44),
			index: options?.bip84?.addressIndex,
			purpose: 84,
		};

		return this.#derive(
			"bip84",
			levels,
			bitcoin.payments.p2wpkh({
				network: this.#network,
				pubkey: BIP44.deriveChild(mnemonic, levels).publicKey,
			}),
		);
	}

	public walletDataHelper(levels: Levels, bipLevel: BipLevel, accountKey: BIP32Interface): WalletDataHelper {
		return new WalletDataHelper(
			levels,
			bipLevel,
			accountKey,
			this.#network,
			this.#httpClient,
			this.#hostSelector,
			this.#configRepository,
		);
	}

	public musigWalletDataHelper(
		n: number,
		accountPublicKeys: BIP32Interface[],
		method: Services.MusigDerivationMethod,
	): MusigWalletDataHelper {
		return new MusigWalletDataHelper(
			n,
			accountPublicKeys,
			method,
			this.#network,
			this.#httpClient,
			this.#hostSelector,
			this.#configRepository,
		);
	}

	#derive(type: BipLevel, levels: Levels, payment: bitcoin.payments.Payment): Services.AddressDataTransferObject {
		const { address } = payment;

		if (!address) {
			throw new Error("Failed to derive an address.");
		}

		return { address, path: BIP44.stringify(levels), type };
	}
}
