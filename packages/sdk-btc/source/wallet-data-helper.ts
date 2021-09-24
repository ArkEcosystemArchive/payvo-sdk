import { Coins, Exceptions, Http, Services } from "@payvo/sdk";
import { getDerivationMethod, walletUsedAddresses } from "./helpers";
import * as bitcoin from "bitcoinjs-lib";
import { Levels } from "./address.factory";
import { BIP44 } from "@payvo/cryptography";
import { Bip44Address } from "./contracts";

export default class WalletDataHelper {
	readonly #bipLevel: Levels;
	readonly #spendAddressGenerator;
	readonly #changeAddressGenerator;
	readonly #network: bitcoin.networks.Network;

	readonly #discoveredSpendAddresses: Bip44Address[] = [];
	readonly #discoveredChangeAddresses: Bip44Address[] = [];
	readonly #httpClient: Http.HttpClient;
	readonly #configRepository: Coins.ConfigRepository;

	public constructor(
		bipLevel: Levels,
		id: Services.WalletIdentifier,
		network: bitcoin.networks.Network,
		httpClient: Http.HttpClient,
		configRepository: Coins.ConfigRepository,
	) {
		if (id.type !== "extendedPublicKey") {
			throw new Exceptions.Exception("invalid id type for walletData");
		}
		this.#bipLevel = bipLevel;
		this.#network = network;
		this.#spendAddressGenerator = this.#addressGenerator(
			bipLevel,
			getDerivationMethod(id),
			network,
			id.value,
			true,
			100,
		);
		this.#changeAddressGenerator = this.#addressGenerator(
			bipLevel,
			getDerivationMethod(id),
			network,
			id.value,
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
		return this.#discoveredSpendAddresses
			.concat(this.#discoveredChangeAddresses)
			.filter((address) => address.status === "used");
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
		extendedPublicKey: string,
		isSpend: boolean,
		chunkSize: number,
		max: number = Number.MAX_VALUE,
	): Generator<Bip44Address[]> {
		let index = 0;
		const chain = isSpend ? 0 : 1;
		const node = bitcoin.bip32.fromBase58(extendedPublicKey, network).derive(chain);
		while (index < max) {
			const chunk: Bip44Address[] = [];
			for (let i = 0; i < chunkSize; i++) {
				chunk.push({
					path: BIP44.stringify({
						...bipLevel,
						change: chain,
						index,
					}),
					address: bip(node.derive(index++).publicKey, network),
					status: "unknown",
				});
			}
			yield chunk;
		}
	};
}
