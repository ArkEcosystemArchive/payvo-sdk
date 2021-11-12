import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "GAS",
		type: "free",
	},
	memo: true,
	types: ["transfer"],
};

export const importMethods: Networks.NetworkManifestImportMethods = {
	address: {
		default: false,
		permissions: ["read"],
	},
	bip44: {
		default: true,
		permissions: ["read", "write"],
	},
	publicKey: {
		default: false,
		permissions: ["read"],
	},
};

export const featureFlags: Networks.NetworkManifestFeatureFlags = {
	Address: ["mnemonic.bip44", "privateKey", "publicKey", "validate", "wif"],
	Client: ["transactions", "wallet", "broadcast"],
	KeyPair: ["mnemonic.bip44", "privateKey", "wif"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip44", "wif"],
	PublicKey: ["mnemonic.bip44", "wif"],
	Transaction: ["transfer"],
	WIF: ["mnemonic.bip44"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "block/height/{0}",
	transaction: "tx/{0}",
	wallet: "address/{0}",
};
