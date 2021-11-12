import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "NANO",
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
	Address: ["mnemonic.bip44", "privateKey", "publicKey", "validate"],
	Client: ["transactions", "wallet", "broadcast"],
	KeyPair: ["mnemonic.bip44"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip44"],
	PublicKey: ["mnemonic.bip44"],
	Transaction: ["transfer"],
	WIF: ["mnemonic.bip44"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "explorer/block/{0}",
	transaction: "explorer/block/{0}",
	wallet: "explorer/account/{0}",
};
