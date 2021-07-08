import { Networks } from "@payvo/sdk";

import { featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "lsk.testnet",
	type: "test",
	name: "Testnet",
	coin: "Lisk",
	currency: {
		ticker: "LSK",
		symbol: "LSK",
		decimals: 8,
	},
	constants: {
		slip44: 134,
	},
	hosts: [
		{
			type: "full",
			host: "https://testnet.lisk.io",
		},
		{
			type: "explorer",
			host: "https://ams1-testnet-explorer-001.lisk.io/",
		},
	],
	governance: {
		delegateCount: 101,
		votesPerWallet: 101,
		votesPerTransaction: 33,
	},
	transactions,
	importMethods,
	featureFlags,
	explorer: {
		block: "block/{0}",
		transaction: "tx/{0}",
		wallet: "address/{0}",
	},
	meta: {
		// @TODO
		networkId: "da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba",
		moduleIds: {
			"token:transfer": 2,
			"keys:registerMultisignatureGroup": 4,
			"dpos:registerDelegate": 5,
			"dpos:voteDelegate": 5,
			"dpos:unlockToken": 5,
			"dpos:reportDelegateMisbehavior": 5,
			"legacyAccount:reclaimLSK": 1000,
		},
		assetIds: {
			"token:transfer": 0,
			"keys:registerMultisignatureGroup": 0,
			"dpos:registerDelegate": 0,
			"dpos:voteDelegate": 1,
			"dpos:unlockToken": 2,
			"dpos:reportDelegateMisbehavior": 3,
			"legacyAccount:reclaimLSK": 0,
		},
		schemas: [
			{
				moduleAssetId: "2:0",
				moduleAssetName: "token:transfer",
				schema: {
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
			{
				moduleAssetId: "4:0",
				moduleAssetName: "keys:registerMultisignatureGroup",
				schema: {
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
			{
				moduleAssetId: "5:0",
				moduleAssetName: "dpos:registerDelegate",
				schema: {
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
			{
				moduleAssetId: "5:1",
				moduleAssetName: "dpos:voteDelegate",
				schema: {
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
			{
				moduleAssetId: "5:2",
				moduleAssetName: "dpos:unlockToken",
				schema: {
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
			{
				moduleAssetId: "5:3",
				moduleAssetName: "dpos:reportDelegateMisbehavior",
				schema: {
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
			{
				moduleAssetId: "1000:0",
				moduleAssetName: "legacyAccount:reclaimLSK",
				schema: {
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
		],
	},
};

export default network;
