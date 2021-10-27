import { Networks } from "@payvo/sdk";

export const transactions: Networks.NetworkManifestTransactions = {
	expirationType: "height",
	types: ["delegateRegistration", "secondSignature", "transfer", "unlockToken", "vote"],
	fees: {
		type: "size",
		ticker: "LSK",
	},
	memo: true,
	multiSignatureType: "advanced",
	lockedBalance: true,
};

export const importMethods: Networks.NetworkManifestImportMethods = {
	address: {
		default: false,
		permissions: ["read"],
	},
	bip39: {
		default: true,
		permissions: ["read", "write"],
		canBeEncrypted: true,
	},
	publicKey: {
		default: false,
		permissions: ["read"],
	},
};

export const featureFlags: Networks.NetworkManifestFeatureFlags = {
	Client: ["transaction", "transactions", "wallet", "wallets", "delegate", "delegates", "votes", "broadcast"],
	Fee: ["all", "calculate"],
	Address: ["mnemonic.bip39", "publicKey", "validate"],
	KeyPair: ["mnemonic.bip39"],
	PrivateKey: ["mnemonic.bip39"],
	PublicKey: ["mnemonic.bip39"],
	Ledger: ["getVersion", "getPublicKey", "signTransaction", "signMessage"],
	Message: ["sign", "verify"],
	Transaction: ["delegateRegistration", "multiSignature", "transfer", "unlockToken", "vote"],
};

export const explorer = {
	block: "block/{0}",
	transaction: "transaction/{0}",
	wallet: "account/{0}",
};

export const governance: any = {
	delegateIdentifier: "address",
	delegateCount: 101,
	votesPerWallet: 10,
	votesPerTransaction: 20,
	votesAmountStep: 10,
	votesAmountMinimum: 10,
};

// https://lsk-test.payvo.com/api/v2/transactions/schemas
export const assets = {
	"token:transfer": {
		maximumFee: 1e8,
		moduleAssetId: "2:0",
		moduleAssetName: "token:transfer",
		moduleID: 2,
		assetID: 0,
		assetSchema: {
			$id: "lisk/transfer-asset",
			title: "Transfer transaction asset",
			type: "object",
			required: ["amount", "recipientAddress", "data"],
			properties: {
				amount: {
					dataType: "uint64",
					fieldNumber: 1,
				},
				recipientAddress: {
					dataType: "bytes",
					fieldNumber: 2,
					minLength: 20,
					maxLength: 20,
				},
				data: {
					dataType: "string",
					fieldNumber: 3,
					minLength: 0,
					maxLength: 64,
				},
			},
		},
	},
	"keys:registerMultisignatureGroup": {
		maximumFee: 5e8,
		moduleAssetId: "4:0",
		moduleAssetName: "keys:registerMultisignatureGroup",
		moduleID: 4,
		assetID: 0,
		assetSchema: {
			$id: "lisk/keys/register",
			type: "object",
			required: ["numberOfSignatures", "optionalKeys", "mandatoryKeys"],
			properties: {
				numberOfSignatures: {
					dataType: "uint32",
					fieldNumber: 1,
					minimum: 1,
					maximum: 64,
				},
				mandatoryKeys: {
					type: "array",
					items: {
						dataType: "bytes",
						minLength: 32,
						maxLength: 32,
					},
					fieldNumber: 2,
					minItems: 0,
					maxItems: 64,
				},
				optionalKeys: {
					type: "array",
					items: {
						dataType: "bytes",
						minLength: 32,
						maxLength: 32,
					},
					fieldNumber: 3,
					minItems: 0,
					maxItems: 64,
				},
			},
		},
	},
	"dpos:registerDelegate": {
		maximumFee: 25e8,
		moduleAssetId: "5:0",
		moduleAssetName: "dpos:registerDelegate",
		moduleID: 5,
		assetID: 0,
		assetSchema: {
			$id: "lisk/dpos/register",
			type: "object",
			required: ["username"],
			properties: {
				username: {
					dataType: "string",
					fieldNumber: 1,
					minLength: 1,
					maxLength: 20,
				},
			},
		},
	},
	"dpos:voteDelegate": {
		maximumFee: 1e8,
		moduleAssetId: "5:1",
		moduleAssetName: "dpos:voteDelegate",
		moduleID: 5,
		assetID: 1,
		assetSchema: {
			$id: "lisk/dpos/vote",
			type: "object",
			required: ["votes"],
			properties: {
				votes: {
					type: "array",
					minItems: 1,
					maxItems: 20,
					items: {
						type: "object",
						required: ["delegateAddress", "amount"],
						properties: {
							delegateAddress: {
								dataType: "bytes",
								fieldNumber: 1,
								minLength: 20,
								maxLength: 20,
							},
							amount: {
								dataType: "sint64",
								fieldNumber: 2,
							},
						},
					},
					fieldNumber: 1,
				},
			},
		},
	},
	"dpos:unlockToken": {
		maximumFee: 1e8,
		moduleAssetId: "5:2",
		moduleAssetName: "dpos:unlockToken",
		moduleID: 5,
		assetID: 2,
		assetSchema: {
			$id: "lisk/dpos/unlock",
			type: "object",
			required: ["unlockObjects"],
			properties: {
				unlockObjects: {
					type: "array",
					minItems: 1,
					maxItems: 20,
					items: {
						type: "object",
						required: ["delegateAddress", "amount", "unvoteHeight"],
						properties: {
							delegateAddress: {
								dataType: "bytes",
								fieldNumber: 1,
								minLength: 20,
								maxLength: 20,
							},
							amount: {
								dataType: "uint64",
								fieldNumber: 2,
							},
							unvoteHeight: {
								dataType: "uint32",
								fieldNumber: 3,
							},
						},
					},
					fieldNumber: 1,
				},
			},
		},
	},
	"dpos:reportDelegateMisbehavior": {
		maximumFee: 1e8,
		moduleAssetId: "5:3",
		moduleAssetName: "dpos:reportDelegateMisbehavior",
		moduleID: 5,
		assetID: 3,
		assetSchema: {
			$id: "lisk/dpos/pom",
			type: "object",
			required: ["header1", "header2"],
			properties: {
				header1: {
					$id: "lisk/block-header",
					type: "object",
					properties: {
						version: {
							dataType: "uint32",
							fieldNumber: 1,
						},
						timestamp: {
							dataType: "uint32",
							fieldNumber: 2,
						},
						height: {
							dataType: "uint32",
							fieldNumber: 3,
						},
						previousBlockID: {
							dataType: "bytes",
							fieldNumber: 4,
						},
						transactionRoot: {
							dataType: "bytes",
							fieldNumber: 5,
						},
						generatorPublicKey: {
							dataType: "bytes",
							fieldNumber: 6,
						},
						reward: {
							dataType: "uint64",
							fieldNumber: 7,
						},
						asset: {
							type: "object",
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
						},
						signature: {
							dataType: "bytes",
							fieldNumber: 9,
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
					fieldNumber: 1,
				},
				header2: {
					$id: "lisk/block-header",
					type: "object",
					properties: {
						version: {
							dataType: "uint32",
							fieldNumber: 1,
						},
						timestamp: {
							dataType: "uint32",
							fieldNumber: 2,
						},
						height: {
							dataType: "uint32",
							fieldNumber: 3,
						},
						previousBlockID: {
							dataType: "bytes",
							fieldNumber: 4,
						},
						transactionRoot: {
							dataType: "bytes",
							fieldNumber: 5,
						},
						generatorPublicKey: {
							dataType: "bytes",
							fieldNumber: 6,
						},
						reward: {
							dataType: "uint64",
							fieldNumber: 7,
						},
						asset: {
							type: "object",
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
						},
						signature: {
							dataType: "bytes",
							fieldNumber: 9,
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
					fieldNumber: 2,
				},
			},
		},
	},
	"legacyAccount:reclaimLSK": {
		maximumFee: 1e8,
		moduleAssetId: "1000:0",
		moduleAssetName: "legacyAccount:reclaimLSK",
		moduleID: 1000,
		assetID: 0,
		assetSchema: {
			$id: "lisk/legacyAccount/reclaim",
			title: "Reclaim transaction asset",
			type: "object",
			required: ["amount"],
			properties: {
				amount: {
					dataType: "uint64",
					fieldNumber: 1,
				},
			},
		},
	},
};
