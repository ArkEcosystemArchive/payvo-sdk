import { Coins, Exceptions, Http, Networks } from "@payvo/sdk";
import { BIP32Interface, BIP44 } from "@payvo/sdk-cryptography";
import { convertBuffer, convertString } from "@payvo/sdk-helpers";
import * as bitcoin from "bitcoinjs-lib";

import { Bip44Address, Bip44AddressWithKeys, BipLevel, Levels, UnspentTransaction } from "./contracts.js";
import { getDerivationFunction, post, walletUsedAddresses } from "./helpers.js";

export default class WalletDataHelper {
	readonly #levels: Levels;
	readonly #bipLevel: BipLevel;
	readonly #accountKey: BIP32Interface;
	readonly #spendAddressGenerator: Generator<Bip44AddressWithKeys[]>;
	readonly #changeAddressGenerator: Generator<Bip44AddressWithKeys[]>;
	readonly #network: bitcoin.networks.Network;

	readonly #discoveredSpendAddresses: Bip44AddressWithKeys[] = [];
	readonly #discoveredChangeAddresses: Bip44AddressWithKeys[] = [];
	readonly #httpClient: Http.HttpClient;
	readonly #hostSelector: Networks.NetworkHostSelector;
	readonly #configRepository: Coins.ConfigRepository;

	public constructor(
		levels: Levels,
		bipLevel: BipLevel,
		accountKey: BIP32Interface,
		network: bitcoin.networks.Network,
		httpClient: Http.HttpClient,
		hostSelector: Networks.NetworkHostSelector,
		configRepository: Coins.ConfigRepository,
	) {
		this.#levels = levels;
		this.#bipLevel = bipLevel;
		this.#accountKey = accountKey;
		this.#network = network;
		this.#spendAddressGenerator = this.#addressGenerator(
			levels,
			getDerivationFunction(bipLevel),
			network,
			accountKey,
			true,
			100,
		);
		this.#changeAddressGenerator = this.#addressGenerator(
			levels,
			getDerivationFunction(bipLevel),
			network,
			accountKey,
			false,
			100,
		);
		this.#httpClient = httpClient;
		this.#hostSelector = hostSelector;
		this.#configRepository = configRepository;
	}

	public discoveredSpendAddresses(): Bip44Address[] {
		return this.#discoveredSpendAddresses;
	}

	public discoveredChangeAddresses(): Bip44Address[] {
		return this.#discoveredChangeAddresses;
	}

	public async discoverAllUsed(): Promise<void> {
		await this.#usedAddresses(this.#spendAddressGenerator, this.#discoveredSpendAddresses);
		await this.#usedAddresses(this.#changeAddressGenerator, this.#discoveredChangeAddresses);
	}

	public firstUnusedChangeAddress(): Bip44Address {
		if (this.#discoveredChangeAddresses.length === 0) {
			throw new Exceptions.Exception("No discovered addresses yet. Call discoverAllUsed() first");
		}

		return this.#discoveredChangeAddresses.find((address) => address.status === "unused")!;
	}

	public allUsedAddresses(): Bip44Address[] {
		return this.#allUsedAddresses();
	}

	public signingKeysForAddress(address: string): Bip44AddressWithKeys {
		const found = this.#allUsedAddresses().find((a) => a.address === address);
		if (!found) {
			throw new Exceptions.Exception(`Address ${address} not found.`);
		}
		return found;
	}

	public async unspentTransactionOutputs(): Promise<UnspentTransaction[]> {
		const addresses = this.#allUsedAddresses().map((address) => address.address);

		const utxos = await this.#unspentTransactionOutputs(addresses);

		return utxos.map((utxo) => {
			const addressWithKeys: Bip44AddressWithKeys = this.signingKeysForAddress(utxo.address);

			let extra;
			if (this.isBip44()) {
				extra = {
					nonWitnessUtxo: convertString(utxo.raw),
				};
			} else if (this.isBip49()) {
				const payment = bitcoin.payments.p2sh({
					network: this.#network,
					redeem: bitcoin.payments.p2wpkh({
						network: this.#network,
						pubkey: convertString(addressWithKeys.publicKey),
					}),
				});

				if (!payment.redeem) {
					throw new Error("The [payment.redeem] property is empty. This looks like a bug.");
				}

				extra = {
					redeemScript: payment.redeem.output,
					witnessUtxo: {
						script: convertString(utxo.script),
						value: utxo.satoshis,
					},
				};
			} else if (this.isBip84()) {
				extra = {
					witnessUtxo: {
						script: convertString(utxo.script),
						value: utxo.satoshis,
					},
				};
			}
			return {
				address: utxo.address,
				path: addressWithKeys.path,
				publicKey: convertString(addressWithKeys.publicKey),
				script: utxo.script,
				signingKey: addressWithKeys.privateKey ? convertString(addressWithKeys.privateKey) : undefined,
				txId: utxo.txId,
				txRaw: utxo.raw,
				value: utxo.satoshis,
				vout: utxo.outputIndex,
				...extra,
			};
		});
	}

	public isBip44(): boolean {
		return this.#levels.purpose === 44;
	}

	public isBip49(): boolean {
		return this.#levels.purpose === 49;
	}

	public isBip84(): boolean {
		return this.#levels.purpose === 84;
	}

	async #usedAddresses(
		addressesGenerator: Generator<Bip44Address[]>,
		discoveredAddresses: Bip44Address[],
	): Promise<void> {
		let exhausted = false;
		do {
			const addressChunk: Bip44Address[] = addressesGenerator.next().value;

			const used: { string: boolean }[] = await walletUsedAddresses(
				addressChunk.map((address) => address.address),
				this.#httpClient,
				this.#hostSelector,
				this.#configRepository,
			);

			for (const address of addressChunk) {
				address.status = used[address.address] ? "used" : "unused";
			}
			discoveredAddresses.push(...addressChunk);

			exhausted = Object.values(used)
				.slice(-20)
				.every((x) => !x);
		} while (!exhausted);
	}

	#addressGenerator = function* (
		bipLevel: Levels,
		bip: (publicKey, network) => string,
		network: bitcoin.Network,
		accountKey: BIP32Interface,
		isSpend: boolean,
		chunkSize: number,
		max: number = Number.MAX_VALUE,
	): Generator<Bip44AddressWithKeys[]> {
		let index = 0;
		const chain = isSpend ? 0 : 1;
		while (index < max) {
			const chunk: Bip44AddressWithKeys[] = [];
			for (let index_ = 0; index_ < chunkSize; index_++) {
				const localNode = accountKey.derive(chain).derive(index);
				chunk.push({
					address: bip(localNode.publicKey, network),
					path: BIP44.stringify({
						...bipLevel,
						change: chain,
						index,
					}),
					privateKey: localNode.privateKey ? convertBuffer(localNode.privateKey) : undefined,
					publicKey: convertBuffer(localNode.publicKey),
					status: "unknown",
				});
				index++;
			}
			yield chunk;
		}
	};

	#allUsedAddresses(): Bip44AddressWithKeys[] {
		return this.#discoveredSpendAddresses
			.concat(this.#discoveredChangeAddresses)
			.filter((address) => address.status === "used");
	}

	async #unspentTransactionOutputs(addresses: string[]): Promise<UnspentTransaction[]> {
		const utxos = (
			await post(
				`wallets/transactions/unspent`,
				{ addresses },
				this.#httpClient,
				this.#hostSelector,
				this.#configRepository,
			)
		).data;

		const rawTxs = (
			await post(
				`wallets/transactions/raw`,
				{ transaction_ids: utxos.map((utxo) => utxo.txId) },
				this.#httpClient,
				this.#hostSelector,
				this.#configRepository,
			)
		).data;

		return utxos.map((utxo) => ({
			...utxo,
			raw: rawTxs[utxo.txId],
		}));
	}
}
