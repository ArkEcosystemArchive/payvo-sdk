import { Coins, Exceptions, Http } from "@payvo/sdk";
import { convertString } from "@payvo/helpers";
import { post, walletUsedAddresses } from "./helpers";
import * as bitcoin from "bitcoinjs-lib";
import { Bip44Address, MusigDerivationMethod, UnspentTransaction } from "./contracts";
import { legacyMusig, nativeSegwitMusig, p2SHSegwitMusig } from "./address.domain";

const getDerivationFunction = (
	method: MusigDerivationMethod,
): ((n: number, pubkeys: Buffer[], network: bitcoin.Network) => bitcoin.Payment) => {
	return { legacyMusig, p2SHSegwitMusig, nativeSegwitMusig }[method];
};

export default class MusigWalletDataHelper {
	readonly #n: number;
	readonly #creatorRootKey: bitcoin.BIP32Interface;
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
		creatorRootKey: bitcoin.BIP32Interface,
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
		this.#creatorRootKey = creatorRootKey;
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

	public async unspentTransactionOutputs(): Promise<UnspentTransaction[]> {
		const addresses = this.allUsedAddresses().map((address) => address.address);

		const utxos = await this.#unspentTransactionOutputs(addresses);
		// @ts-ignore
		return utxos.map((utxo) => {
			const address: Bip44Address = this.#signingKeysForAddress(utxo.address);

			const accountKey = this.#creatorRootKey.derivePath("m/48'/1'/0'/2'"); // TODO path to come from input

			return {
				address: utxo.address,
				txId: utxo.txId,
				txRaw: utxo.raw,
				script: utxo.script,
				vout: utxo.outputIndex,
				value: utxo.satoshis,
				path: address.path,
				bip32Derivation: this.#accountPublicKeys.map((pubKey, index) => ({
					masterFingerprint: accountKey.fingerprint.equals(pubKey.fingerprint)
						? this.#creatorRootKey.fingerprint
						: pubKey.fingerprint,
					path: accountKey.fingerprint.equals(pubKey.fingerprint)
						? "m/48'/1'/0'/2'/" + address.path
						: "m/" + address.path,
					pubkey: pubKey.derivePath(address.path).publicKey,
				})),
				nonWitnessUtxo: convertString(utxo.raw), // TODO this should depend on the utxo, whether to use nonWitness or witness
				// witnessUtxo: {
				// 	script: convertString(utxo.script),
				// 	value: utxo.satoshis,
				// },
				witnessScript: getDerivationFunction(this.#method)(
					this.#n,
					this.#accountPublicKeys.map((apk) => apk.derivePath(address.path).publicKey),
					this.#network,
				).redeem!.output,
			};
		});
	}

	#signingKeysForAddress(address: string): Bip44Address {
		const found = this.allUsedAddresses().find((a) => a.address === address);
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
		n: number,
		accountKeys: bitcoin.BIP32Interface[],
		bip: (n: number, publicKeys: Buffer[], network: bitcoin.Network) => bitcoin.Payment,
		network: bitcoin.Network,
		chain: number,
		chunkSize: number,
		max: number = Number.MAX_VALUE,
	): Generator<Bip44Address[]> {
		let index = 0;
		while (index < max) {
			const chunk: Bip44Address[] = [];
			for (let i = 0; i < chunkSize; i++) {
				chunk.push({
					path: `${chain}/${index}`,
					address: bip(
						n,
						accountKeys.map((pubKey) => pubKey.derive(chain).derive(index).publicKey),
						network,
					).address!,
					status: "unknown",
				});
				index++;
			}
			yield chunk;
		}
	};

	async #unspentTransactionOutputs(addresses: string[]): Promise<UnspentTransaction[]> {
		if (addresses.length === 0) {
			return [];
		}
		const utxos = (
			await post(`wallets/transactions/unspent`, { addresses }, this.#httpClient, this.#configRepository)
		).data;

		const rawTxs = (
			await post(
				`wallets/transactions/raw`,
				{ transaction_ids: utxos.map((utxo) => utxo.txId) },
				this.#httpClient,
				this.#configRepository,
			)
		).data;

		return utxos.map((utxo) => ({
			...utxo,
			raw: rawTxs[utxo.txId],
		}));
	}
}
