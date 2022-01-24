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
			host: "https://eth-test.payvo.com/api",
			type: "full",
		},
		{
			host: "https://ropsten.etherscan.io",
			type: "explorer",
		},
	],
	id: "eth.ropsten",
	importMethods,
	meta: {
		// @TODO
		networkId: "3",
	},
	name: "Ropsten",
	transactions,
	type: "test",
};

export default network;
