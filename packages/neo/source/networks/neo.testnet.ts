import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	coin: "NEO",
	constants: {
		slip44: 888,
	},
	currency: {
		decimals: 8,
		symbol: "NEO",
		ticker: "NEO",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://testnet1.neo2.coz.io:443",
			type: "full",
		},
		{
			host: "https://testnet2.neo2.coz.io:443",
			type: "full",
		},
		{
			host: "https://testnet3.neo2.coz.io:443",
			type: "full",
		},
		{
			host: "http://seed1.ngd.network:20332",
			type: "full",
		},
		{
			host: "http://seed2.ngd.network:20332",
			type: "full",
		},
		{
			host: "https://neoscan-testnet.io",
			type: "explorer",
		},
	],
	id: "neo.testnet",
	importMethods,
	name: "Testnet",
	transactions,
	type: "test",
};

export default network;
