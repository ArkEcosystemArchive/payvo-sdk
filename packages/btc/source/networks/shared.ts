import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "BTC",
		type: "dynamic",
	},
	types: ["transfer"],
	utxo: true,
};

export const importMethods: Networks.NetworkManifestImportMethods = {
	address: {
		default: false,
		permissions: ["read"],
	},
	bip38: {
		default: false,
		permissions: ["read", "write"],
	},
	discovery: {
		default: true,
		permissions: ["read", "write"],
	},
	privateKey: {
		default: false,
		permissions: ["read", "write"],
	},
	publicKey: {
		default: false,
		permissions: ["read"],
	},
	wif: {
		default: false,
		permissions: ["read", "write"],
	},
};

export const featureFlags: Networks.NetworkManifestFeatureFlags = {
	Address: [
		"mnemonic.bip39",
		"mnemonic.bip44",
		"mnemonic.bip49",
		"mnemonic.bip84",
		"privateKey",
		"publicKey",
		"validate",
		"wif",
	],
	Client: ["transaction", "transactions", "wallet", "broadcast"],
	KeyPair: ["mnemonic.bip39", "mnemonic.bip44", "mnemonic.bip49", "mnemonic.bip84", "privateKey", "wif"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip39", "mnemonic.bip44", "mnemonic.bip49", "mnemonic.bip84", "wif"],
	PublicKey: ["mnemonic.bip39", "mnemonic.bip44", "mnemonic.bip49", "mnemonic.bip84", "wif"],
	Transaction: ["multiSignature", "transfer"],
	WIF: ["mnemonic.bip39", "mnemonic.bip44", "mnemonic.bip49", "mnemonic.bip84"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "block/{0}",
	transaction: "tx/{0}",
	wallet: "address/{0}",
};
