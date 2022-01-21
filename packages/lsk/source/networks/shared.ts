import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	fees: {
		ticker: "LSK",
		type: "size",
	},
	lockedBalance: true,
	memo: true,
	multiSignatureType: "advanced",
	types: ["delegateRegistration", "transfer", "unlockToken", "vote"],
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
};

export const featureFlags: Networks.NetworkManifestFeatureFlags = {
	Address: ["mnemonic.bip39", "publicKey", "validate"],
	Client: ["transaction", "transactions", "wallet", "wallets", "delegate", "delegates", "votes", "broadcast"],
	Fee: ["all", "calculate"],
	KeyPair: ["mnemonic.bip39"],
	Ledger: ["getVersion", "getPublicKey", "signTransaction", "signMessage"],
	Message: ["sign", "verify"],
	PrivateKey: ["mnemonic.bip39"],
	PublicKey: ["mnemonic.bip39"],
	Transaction: ["delegateRegistration", "transfer", "unlockToken", "vote"],
};

export const explorer = {
	block: "block/{0}",
	transaction: "transaction/{0}",
	wallet: "account/{0}",
};

export const governance: any = {
	delegateCount: 101,
	delegateIdentifier: "address",
	votesAmountMinimum: 10,
	votesAmountStep: 10,
	votesPerTransaction: 20,
	votesPerWallet: 10,
};

// https://lsk-test.payvo.com/api/v2/transactions/schemas
export const assets = {
	"dpos:registerDelegate": {
		assetID: 0,
		assetSchema: {
			$id: "lisk/dpos/register",
			properties: {
				username: {
					dataType: "string",
					fieldNumber: 1,
					maxLength: 20,
					minLength: 1,
				},
			},
			required: ["username"],
			type: "object",
		},
		maximumFee: 25e8,
		moduleAssetId: "5:0",
		moduleAssetName: "dpos:registerDelegate",
		moduleID: 5,
	},
	"dpos:reportDelegateMisbehavior": {
		assetID: 3,
		assetSchema: {
			$id: "lisk/dpos/pom",
			properties: {
				header1: {
					$id: "lisk/block-header",
					fieldNumber: 1,
					properties: {
						asset: {
							fieldNumber: 8,
							properties: {
								maxHeightPreviouslyForged: {
									dataType: "uint32",
									fieldNumber: 1,
								},
								maxHeightPrevoted: {
									dataType: "uint32",
									fieldNumber: 2,
								},
								seedReveal: {
									dataType: "bytes",
									fieldNumber: 3,
								},
							},
							required: ["maxHeightPreviouslyForged", "maxHeightPrevoted", "seedReveal"],
							type: "object",
						},
						generatorPublicKey: {
							dataType: "bytes",
							fieldNumber: 6,
						},
						height: {
							dataType: "uint32",
							fieldNumber: 3,
						},
						previousBlockID: {
							dataType: "bytes",
							fieldNumber: 4,
						},
						reward: {
							dataType: "uint64",
							fieldNumber: 7,
						},
						signature: {
							dataType: "bytes",
							fieldNumber: 9,
						},
						timestamp: {
							dataType: "uint32",
							fieldNumber: 2,
						},
						transactionRoot: {
							dataType: "bytes",
							fieldNumber: 5,
						},
						version: {
							dataType: "uint32",
							fieldNumber: 1,
						},
					},
					required: [
						"version",
						"timestamp",
						"height",
						"previousBlockID",
						"transactionRoot",
						"generatorPublicKey",
						"reward",
						"asset",
					],
					type: "object",
				},
				header2: {
					$id: "lisk/block-header",
					fieldNumber: 2,
					properties: {
						asset: {
							fieldNumber: 8,
							properties: {
								maxHeightPreviouslyForged: {
									dataType: "uint32",
									fieldNumber: 1,
								},
								maxHeightPrevoted: {
									dataType: "uint32",
									fieldNumber: 2,
								},
								seedReveal: {
									dataType: "bytes",
									fieldNumber: 3,
								},
							},
							required: ["maxHeightPreviouslyForged", "maxHeightPrevoted", "seedReveal"],
							type: "object",
						},
						generatorPublicKey: {
							dataType: "bytes",
							fieldNumber: 6,
						},
						height: {
							dataType: "uint32",
							fieldNumber: 3,
						},
						previousBlockID: {
							dataType: "bytes",
							fieldNumber: 4,
						},
						reward: {
							dataType: "uint64",
							fieldNumber: 7,
						},
						signature: {
							dataType: "bytes",
							fieldNumber: 9,
						},
						timestamp: {
							dataType: "uint32",
							fieldNumber: 2,
						},
						transactionRoot: {
							dataType: "bytes",
							fieldNumber: 5,
						},
						version: {
							dataType: "uint32",
							fieldNumber: 1,
						},
					},
					required: [
						"version",
						"timestamp",
						"height",
						"previousBlockID",
						"transactionRoot",
						"generatorPublicKey",
						"reward",
						"asset",
					],
					type: "object",
				},
			},
			required: ["header1", "header2"],
			type: "object",
		},
		maximumFee: 1e8,
		moduleAssetId: "5:3",
		moduleAssetName: "dpos:reportDelegateMisbehavior",
		moduleID: 5,
	},
	"dpos:unlockToken": {
		assetID: 2,
		assetSchema: {
			$id: "lisk/dpos/unlock",
			properties: {
				unlockObjects: {
					fieldNumber: 1,
					items: {
						properties: {
							amount: {
								dataType: "uint64",
								fieldNumber: 2,
							},
							delegateAddress: {
								dataType: "bytes",
								fieldNumber: 1,
								maxLength: 20,
								minLength: 20,
							},
							unvoteHeight: {
								dataType: "uint32",
								fieldNumber: 3,
							},
						},
						required: ["delegateAddress", "amount", "unvoteHeight"],
						type: "object",
					},
					maxItems: 20,
					minItems: 1,
					type: "array",
				},
			},
			required: ["unlockObjects"],
			type: "object",
		},
		maximumFee: 1e8,
		moduleAssetId: "5:2",
		moduleAssetName: "dpos:unlockToken",
		moduleID: 5,
	},
	"dpos:voteDelegate": {
		assetID: 1,
		assetSchema: {
			$id: "lisk/dpos/vote",
			properties: {
				votes: {
					fieldNumber: 1,
					items: {
						properties: {
							amount: {
								dataType: "sint64",
								fieldNumber: 2,
							},
							delegateAddress: {
								dataType: "bytes",
								fieldNumber: 1,
								maxLength: 20,
								minLength: 20,
							},
						},
						required: ["delegateAddress", "amount"],
						type: "object",
					},
					maxItems: 20,
					minItems: 1,
					type: "array",
				},
			},
			required: ["votes"],
			type: "object",
		},
		maximumFee: 1e8,
		moduleAssetId: "5:1",
		moduleAssetName: "dpos:voteDelegate",
		moduleID: 5,
	},
	"keys:registerMultisignatureGroup": {
		assetID: 0,
		assetSchema: {
			$id: "lisk/keys/register",
			properties: {
				mandatoryKeys: {
					fieldNumber: 2,
					items: {
						dataType: "bytes",
						maxLength: 32,
						minLength: 32,
					},
					maxItems: 64,
					minItems: 0,
					type: "array",
				},
				numberOfSignatures: {
					dataType: "uint32",
					fieldNumber: 1,
					maximum: 64,
					minimum: 1,
				},
				optionalKeys: {
					fieldNumber: 3,
					items: {
						dataType: "bytes",
						maxLength: 32,
						minLength: 32,
					},
					maxItems: 64,
					minItems: 0,
					type: "array",
				},
			},
			required: ["numberOfSignatures", "optionalKeys", "mandatoryKeys"],
			type: "object",
		},
		maximumFee: 5e8,
		moduleAssetId: "4:0",
		moduleAssetName: "keys:registerMultisignatureGroup",
		moduleID: 4,
	},
	"legacyAccount:reclaimLSK": {
		assetID: 0,
		assetSchema: {
			$id: "lisk/legacyAccount/reclaim",
			properties: {
				amount: {
					dataType: "uint64",
					fieldNumber: 1,
				},
			},
			required: ["amount"],
			title: "Reclaim transaction asset",
			type: "object",
		},
		maximumFee: 1e8,
		moduleAssetId: "1000:0",
		moduleAssetName: "legacyAccount:reclaimLSK",
		moduleID: 1000,
	},
	"token:transfer": {
		assetID: 0,
		assetSchema: {
			$id: "lisk/transfer-asset",
			properties: {
				amount: {
					dataType: "uint64",
					fieldNumber: 1,
				},
				data: {
					dataType: "string",
					fieldNumber: 3,
					maxLength: 64,
					minLength: 0,
				},
				recipientAddress: {
					dataType: "bytes",
					fieldNumber: 2,
					maxLength: 20,
					minLength: 20,
				},
			},
			required: ["amount", "recipientAddress", "data"],
			title: "Transfer transaction asset",
			type: "object",
		},
		maximumFee: 1e8,
		moduleAssetId: "2:0",
		moduleAssetName: "token:transfer",
		moduleID: 2,
	},
};
