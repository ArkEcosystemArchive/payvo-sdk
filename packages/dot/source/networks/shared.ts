import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "DOT",
		type: "weight",
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
	Client: ["wallet", "broadcast"],
	KeyPair: ["mnemonic.bip39"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip39"],
	PublicKey: ["mnemonic.bip39"],
	Transaction: ["transfer"],
	WIF: ["mnemonic.bip39"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "block/{0}",
	transaction: "tx/{0}",
	wallet: "address/{0}",
};
