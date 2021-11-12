import { Networks } from "@payvo/sdk";

// @TODO: type
export const constants = {
	slip44: 1815,
};

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "ADA",
		type: "static",
	},
	types: ["transfer"],
	utxo: true,
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
	Address: ["mnemonic.bip44", "publicKey", "validate"],
	Client: ["transaction", "transactions", "wallet", "broadcast"],
	KeyPair: ["mnemonic.bip44"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip44"],
	PublicKey: ["mnemonic.bip44"],
	Transaction: ["estimateExpiration", "transfer"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "block/{0}",
	transaction: "tx/{0}",
	wallet: "address/{0}",
};
