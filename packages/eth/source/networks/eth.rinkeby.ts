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
			host: "https://rinkeby.etherscan.io",
			type: "explorer",
		},
	],
	id: "eth.rinkeby",
	importMethods,
	meta: {
		// @TODO
		networkId: "4",
	},
	name: "Rinkeby",
	transactions,
	type: "test",
};

export default network;
