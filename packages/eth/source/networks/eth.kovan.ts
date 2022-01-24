import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Ethereum",
	constants: {
		slip44: 60,
	},
	currency: {
		decimals: 18,
		symbol: "Ξ",
		ticker: "ETH",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://eth-test.payvo.com",
			type: "full",
		},
		{
			host: "https://kovan.etherscan.io",
			type: "explorer",
		},
	],
	id: "eth.kovan",
	importMethods,
	meta: {
		// @TODO
		networkId: "2",
	},
	name: "Kovan",
	transactions,
	type: "test",
};

export default network;
