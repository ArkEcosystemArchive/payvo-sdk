import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "TRX",
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
	Address: ["mnemonic.bip44", "multiSignature", "privateKey", "publicKey", "validate", "wif"],
	Client: ["transaction", "transactions", "wallet", "broadcast"],
	KeyPair: ["mnemonic.bip44", "privateKey", "wif"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip44", "wif"],
	PublicKey: ["mnemonic.bip44", "multiSignature", "wif"],
	Transaction: ["transfer"],
	WIF: ["mnemonic.bip44"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "#/block/{0}",
	transaction: "#/transaction/{0}",
	wallet: "#/address/{0}",
};
