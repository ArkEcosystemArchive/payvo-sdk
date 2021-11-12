import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "XRP",
		type: "free",
	},
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
	secret: {
		default: true,
		permissions: ["read", "write"],
	},
};

export const featureFlags: Networks.NetworkManifestFeatureFlags = {
	Address: ["mnemonic.bip44", "publicKey", "secret", "validate"],
	Client: ["transaction", "transactions", "wallet", "broadcast"],
	KeyPair: ["mnemonic.bip44", "secret"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip44", "secret"],
	PublicKey: ["mnemonic.bip44", "secret"],
	Transaction: ["transfer"],
	WIF: ["mnemonic.bip44", "secret"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "ledgers/{0}",
	transaction: "transactions/{0}",
	wallet: "accounts/{0}",
};
