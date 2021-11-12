import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "XLM",
		type: "static",
	},
	memo: true,
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
	Client: ["transaction", "transactions", "wallet", "broadcast"],
	KeyPair: ["mnemonic.bip39", "privateKey"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip39"],
	PublicKey: ["mnemonic.bip39"],
	Transaction: ["transfer"],
	WIF: ["mnemonic.bip39"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "ledger/{0}",
	transaction: "tx/{0}",
	wallet: "account/{0}",
};
