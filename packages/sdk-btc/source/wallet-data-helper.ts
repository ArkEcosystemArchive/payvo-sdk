import { Coins, Exceptions, Http } from "@payvo/sdk";
import { getDerivationFunction, walletUsedAddresses } from "./helpers";
import * as bitcoin from "bitcoinjs-lib";
import { BIP44 } from "@payvo/cryptography";
import { Bip44Address, Bip44AddressWithKeys, BipLevel, Levels } from "./contracts";

export default class WalletDataHelper {
	readonly #levels: Levels;
	readonly #bipLevel: BipLevel;
	readonly #accountKey: bitcoin.BIP32Interface;
	readonly #spendAddressGenerator: Generator<Bip44AddressWithKeys[]>;
	readonly #changeAddressGenerator: Generator<Bip44AddressWithKeys[]>;
	readonly #network: bitcoin.networks.Network;

	readonly #discoveredSpendAddresses: Bip44AddressWithKeys[] = [];
	readonly #discoveredChangeAddresses: Bip44AddressWithKeys[] = [];
	readonly #httpClient: Http.HttpClient;
	readonly #configRepository: Coins.ConfigRepository;

	public constructor(
		levels: Levels,
		bipLevel: BipLevel,
		accountKey: bitcoin.BIP32Interface,
		network: bitcoin.networks.Network,
		httpClient: Http.HttpClient,
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
				this.#configRepository,
			);

			addressChunk.forEach((address) => (address.status = used[address.address] ? "used" : "unused"));
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
		accountKey: bitcoin.BIP32Interface,
		isSpend: boolean,
		chunkSize: number,
		max: number = Number.MAX_VALUE,
	): Generator<Bip44AddressWithKeys[]> {
		let index = 0;
		const chain = isSpend ? 0 : 1;
		while (index < max) {
			const chunk: Bip44AddressWithKeys[] = [];
			for (let i = 0; i < chunkSize; i++) {
				const localNode = accountKey.derive(chain).derive(index);
				chunk.push({
					path: BIP44.stringify({
						...bipLevel,
						change: chain,
						index,
					}),
					address: bip(localNode.publicKey, network),
					status: "unknown",
					publicKey: localNode.publicKey.toString("hex"),
					privateKey: localNode.privateKey?.toString("hex"),
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
}
