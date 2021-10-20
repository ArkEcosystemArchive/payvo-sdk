import importFresh from "import-fresh";
import { join } from "path";

import { AbstractServiceProvider } from "./ioc";

export const bundle = (): object => {
	const path: string = "";

	const importFile = (file: string): Record<string, unknown> => importFresh(join(path, file));

	const discoverServices = (): any => {
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
				result[service] = importFile(`${file}.service.js`)[service];
			} catch {
				// File doesn't exist, lets use the default implementation.
			}
		}

		return result;
	};

	const discoverDataTransferObjects = (): any => {
		const services: Record<string, string> = {
			SignedTransactionData: "signed-transaction",
			ConfirmedTransactionData: "confirmed-transaction",
			WalletData: "wallet",
		};

		const result = {};

		for (const [service, file] of Object.entries(services)) {
			try {
				result[service] = importFile(`${file}.dto.js`)[service];
			} catch {
				// File doesn't exist, lets use the default implementation.
			}
		}

		return result;
	};

	const discoverManifest = (): any => {
		try {
			const { manifest } = importFile("manifest.js");

			if (manifest === undefined) {
				throw new Error("Failed to discover the manifest.js file.");
			}

			return manifest;
		} catch {
			throw new Error("Failed to discover the manifest.js file.");
		}
	};

	const discoverServiceProvider = (): any => {
		try {
			return importFile("coin.provider.js").ServiceProvider;
		} catch {
			return AbstractServiceProvider;
		}
	};

	return {
		services: discoverServices(),
		dataTransferObjects: discoverDataTransferObjects(),
		manifest: discoverManifest(),
		serviceProvider: discoverServiceProvider(),
	};
};
