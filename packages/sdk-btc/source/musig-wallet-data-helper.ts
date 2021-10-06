import { Coins, Exceptions, Http } from "@payvo/sdk";
import { walletUsedAddresses } from "./helpers";
import * as bitcoin from "bitcoinjs-lib";
import { Bip44Address, MusigDerivationMethod, SigningKeys } from "./contracts";
import { legacyMusig, nativeSegwitMusig, p2SHSegwitMusig } from "./address.domain";

const getDerivationFunction = (
	method: MusigDerivationMethod,
): ((n: number, pubkeys: Buffer[], network: bitcoin.Network) => bitcoin.Payment) => {
	return { legacyMusig, p2SHSegwitMusig, nativeSegwitMusig }[method];
};

export default class MusigWalletDataHelper {
	readonly #n: number;
	readonly #accountPublicKeys: bitcoin.BIP32Interface[];
	readonly #method: MusigDerivationMethod;
	readonly #network: bitcoin.networks.Network;
	readonly #spendAddressGenerator: Generator<Bip44Address[]>;
	readonly #changeAddressGenerator: Generator<Bip44Address[]>;

	readonly #discoveredSpendAddresses: Bip44Address[] = [];
	readonly #discoveredChangeAddresses: Bip44Address[] = [];
	readonly #httpClient: Http.HttpClient;
	readonly #configRepository: Coins.ConfigRepository;

	public constructor(
		n: number,
		accountPublicKeys: bitcoin.BIP32Interface[],
		method: MusigDerivationMethod,
		network: bitcoin.networks.Network,
		httpClient: Http.HttpClient,
		configRepository: Coins.ConfigRepository,
	) {
		if (n > accountPublicKeys.length) {
			throw new Exceptions.Exception(
				`n (${n}) must be less than or equal to the number of public keys (${accountPublicKeys.length})`,
			);
		}

		this.#n = n;
		this.#accountPublicKeys = accountPublicKeys;
		this.#method = method;
		this.#network = network;
		this.#spendAddressGenerator = this.#addressGenerator(
			this.#n,
			this.#accountPublicKeys,
			getDerivationFunction(method),
			network,
			0,
			100,
		);
		this.#changeAddressGenerator = this.#addressGenerator(
			this.#n,
			this.#accountPublicKeys,
			getDerivationFunction(method),
			network,
			1,
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
		n: number,
		accountKeys: bitcoin.BIP32Interface[],
		bip: (n: number, publicKeys: Buffer[], network: bitcoin.Network) => bitcoin.Payment,
		network: bitcoin.Network,
		chain: number,
		chunkSize: number,
		max: number = Number.MAX_VALUE,
	): Generator<SigningKeys[]> {
		let index = 0;
		while (index < max) {
			const chunk: SigningKeys[] = [];
			for (let i = 0; i < chunkSize; i++) {
				chunk.push({
					path: `${chain}/${index}`,
					address: bip(
						n,
						accountKeys.map((pubKey) => pubKey.derive(chain).derive(index).publicKey),
						network,
					).address!,
					status: "unknown",
					publicKey: "", // TODO Check here
					privateKey: undefined,
				});
				index++;
			}
			yield chunk;
		}
	};
}
