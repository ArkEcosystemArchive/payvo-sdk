import importFresh from "import-fresh";
import { join } from "path";

import { AbstractServiceProvider, Container } from "../ioc";
import { BindingType } from "../ioc/service-provider.contract";
import { CoinManifest, Network, NetworkManifest } from "../networks";
import { NetworkRepository } from "../networks/network-repository";
import { Coin } from "./coin";
import { ConfigKey, ConfigRepository } from "./config";
import { CoinOptions } from "./contracts";
import { Manifest } from "./manifest";

const importFile = (path: string, file: string): Record<string, unknown> => importFresh(join(path, file));

export class CoinFactory {
	public static async make(specification: string, options: CoinOptions): Promise<Coin> {
		const manifest: CoinManifest = await CoinFactory.#discoverManifest(specification);

		// Arrange
		const configRepository: ConfigRepository = new ConfigRepository(options);
		const networkRepository: NetworkRepository = new NetworkRepository(manifest.networks);

		configRepository.set(ConfigKey.Network, networkRepository.get(options.network));

		// Act
		const container = new Container();
		container.constant(BindingType.ConfigRepository, configRepository);
		container.constant(BindingType.Services, await CoinFactory.#discoverServices(specification));
		container.constant(BindingType.ServiceProvider, await CoinFactory.#discoverServiceProvider(specification));
		container.constant(
			BindingType.DataTransferObjects,
			await CoinFactory.#discoverDataTransferObjects(specification),
		);
		container.constant(BindingType.Container, container);
		container.constant(BindingType.HttpClient, options.httpClient);
		container.constant(BindingType.Manifest, new Manifest(manifest));
		container.constant(BindingType.Network, CoinFactory.#createNetwork(manifest, configRepository));
		container.constant(BindingType.NetworkRepository, networkRepository);
		container.constant(BindingType.Specification, specification);

		// @TODO: use container to resolve this and inject values
		return new Coin(container);
	}

	static #createNetwork(manifest: CoinManifest, configRepository: ConfigRepository): Network {
		const network: NetworkManifest = configRepository.get<NetworkManifest>(ConfigKey.Network);

		return new Network(manifest, {
			...manifest.networks[network.id],
			...network,
		});
	}

	static async #discoverServices(path: string): Promise<any> {
		const services: Record<string, string> = {
			AddressService: "address",
			ClientService: "client",
			DataTransferObjectService: "data-transfer-object",
			ExtendedAddressService: "extended-address",
			ExtendedPublicKeyService: "extended-public-key",
			FeeService: "fee",
			KeyPairService: "key-pair",
			KnownWalletService: "known-wallet",
			LedgerService: "ledger",
			LinkService: "link",
			MessageService: "message",
			MultiSignatureService: "multi-signature",
			PrivateKeyService: "private-key",
			PublicKeyService: "public-key",
			SignatoryService: "signatory",
			TransactionService: "transaction",
			WalletDiscoveryService: "wallet-discovery",
			WIFService: "wif",
		};

		const result = {};

		for (const [service, file] of Object.entries(services)) {
			try {
				result[service] = importFile(path, `${file}.service.js`)[service];
			} catch {
				// File doesn't exist, lets use the default implementation.
			}
		}

		return result;
	}

	static async #discoverDataTransferObjects(path: string): Promise<any> {
		const services: Record<string, string> = {
			SignedTransactionData: "signed-transaction",
			ConfirmedTransactionData: "confirmed-transaction",
			WalletData: "wallet",
		};

		const result = {};

		for (const [service, file] of Object.entries(services)) {
			try {
				result[service] = importFile(path, `${file}.dto.js`)[service];
			} catch {
				// File doesn't exist, lets use the default implementation.
			}
		}

		return result;
	}

	static async #discoverManifest(path: string): Promise<any> {
		try {
			const { manifest } = importFile(path, `manifest.js`);

			if (manifest === undefined) {
				throw new Error("Failed to discover the manifest.js file.");
			}

			return manifest;
		} catch {
			throw new Error("Failed to discover the manifest.js file.");
		}
	}

	static async #discoverServiceProvider(path: string): Promise<any> {
		try {
			return importFile(path, `coin.provider.js`).ServiceProvider;
		} catch {
			return AbstractServiceProvider;
		}
	}
}
