import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Avalanche",
	constants: {
		slip44: 9000,
	},
	currency: {
		decimals: 9,
		symbol: "AVAX",
		ticker: "AVAX",
	},
	explorer,
	featureFlags,
	governance: {
		delegateCount: 0,
		method: "transfer",
		votesPerTransaction: 1,
		// @TODO
		votesPerWallet: 1,
	},
	hosts: [
		{
			host: "https://api.avax-test.network",
			type: "full",
		},
		{
			host: "https://avax-test.payvo.com",
			type: "archival",
		},
		{
			host: "https://explorer.avax-test.network",
			type: "explorer",
		},
	],
	id: "avax.testnet",
	importMethods,
	meta: {
		assetId: "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",

		blockchainId: "2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm",
		// @TODO
		networkId: "5",
	},
	name: "Testnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "AVAX",
			type: "static",
		},
	},
	type: "test",
};

export default network;
