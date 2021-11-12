import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "EGLD",
		type: "gas",
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
	secret: {
		canBeEncrypted: true,
		default: false,
		permissions: ["read", "write"],
	},
};

export const featureFlags: Networks.NetworkManifestFeatureFlags = {
	Address: ["mnemonic.bip39", "validate"],
	Client: ["transaction", "transactions", "wallet", "broadcast"],
	KeyPair: ["mnemonic.bip39"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip39"],
	PublicKey: ["mnemonic.bip39"],
	Transaction: ["transfer"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "miniblocks/{0}",
	transaction: "transactions/{0}",
	wallet: "accounts/{0}",
};
