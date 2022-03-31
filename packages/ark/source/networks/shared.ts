import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "ARK",
		type: "dynamic",
	},
	memo: true,
	multiPaymentRecipients: 64,
	types: [
		"delegateRegistration",
		"delegateResignation",
		"ipfs",
		"multiPayment",
		"multiSignature",
		"secondSignature",
		"transfer",
		"vote",
	],
};

export const importMethods: Networks.NetworkManifestImportMethods = {
	address: {
		default: false,
		permissions: ["read"],
	},
	bip39: {
		canBeEncrypted: true,
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
	Address: ["mnemonic.bip39", "multiSignature", "privateKey", "publicKey", "validate", "wif"],
	Client: [
		"transaction",
		"transactions",
		"wallet",
		"wallets",
		"delegate",
		"delegates",
		"votes",
		"voters",
		"broadcast",
	],
	Fee: ["all", "calculate"],
	KeyPair: ["mnemonic.bip39", "privateKey", "wif"],
	Ledger: ["getVersion", "getPublicKey", "signTransaction", "signMessage"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip39", "wif"],
	PublicKey: ["mnemonic.bip39", "multiSignature", "wif"],
	Transaction: [
		"delegateRegistration",
		"delegateResignation",
		"estimateExpiration",
		"ipfs.ledgerS",
		"ipfs.ledgerX",
		"ipfs.musig",
		"ipfs",
		"multiPayment.musig",
		"multiPayment",
		"multiSignature.ledgerX",
		"multiSignature.musig",
		"multiSignature",
		"secondSignature",
		"transfer.ledgerS",
		"transfer.ledgerX",
		"transfer.musig",
		"transfer",
		"vote.ledgerS",
		"vote.ledgerX",
		"vote.musig",
		"vote",
	],
	WIF: ["mnemonic.bip39"],
};

export const explorer: Networks.NetworkManifestExplorer = {
	block: "blocks/{0}",
	transaction: "transactions/{0}",
	wallet: "wallets/{0}",
};
