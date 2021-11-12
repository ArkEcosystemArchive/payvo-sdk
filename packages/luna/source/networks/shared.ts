import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "LUNA",
		type: "dynamic",
	},
	types: ["transfer"],
};

export const importMethods: Networks.NetworkManifestImportMethods = {
	address: {
		default: false,
		permissions: ["read"],
	},
	bip39: {
		default: true,
		permissions: ["read", "write"],
	},
	publicKey: {
		default: false,
		permissions: ["read"],
	},
};

export const featureFlags: Networks.NetworkManifestFeatureFlags = {
	Address: ["mnemonic.bip39", "validate"],
	Client: ["broadcast"],
	KeyPair: ["mnemonic.bip39", "privateKey"],
	PrivateKey: ["mnemonic.bip39"],
	PublicKey: ["mnemonic.bip39"],
	Transaction: ["transfer"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "blocks/{0}",
	transaction: "txs/{0}",
	wallet: "address/{0}",
};
