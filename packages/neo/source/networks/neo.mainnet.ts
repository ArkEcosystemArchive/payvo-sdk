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
			host: "https://seed1.switcheo.network:10331",
			type: "full",
		},
		{
			host: "https://seed3.switcheo.network:10331",
			type: "full",
		},
		{
			host: "http://seed1.ngd.network:10332",
			type: "full",
		},
		{
			host: "http://seed2.ngd.network:10332",
			type: "full",
		},
		{
			host: "http://seed3.ngd.network:10332",
			type: "full",
		},
		{
			host: "http://seed4.ngd.network:10332",
			type: "full",
		},
		{
			host: "http://seed5.ngd.network:10332",
			type: "full",
		},
		{
			host: "http://seed6.ngd.network:10332",
			type: "full",
		},
		{
			host: "http://seed7.ngd.network:10332",
			type: "full",
		},
		{
			host: "http://seed8.ngd.network:10332",
			type: "full",
		},
		{
			host: "http://seed9.ngd.network:10332",
			type: "full",
		},
		{
			host: "https://m2.neo.nash.io",
			type: "full",
		},
		{
			host: "https://m3.neo.nash.io",
			type: "full",
		},
		{
			host: "https://m4.neo.nash.io",
			type: "full",
		},
		{
			host: "https://m5.neo.nash.io",
			type: "full",
		},
		{
			host: "https://mainnet1.neo2.coz.io:443",
			type: "full",
		},
		{
			host: "https://mainnet2.neo2.coz.io:443",
			type: "full",
		},
		{
			host: "https://mainnet3.neo2.coz.io:443",
			type: "full",
		},
		{
			host: "https://neotracker.io",
			type: "explorer",
		},
	],
	id: "neo.mainnet",
	importMethods,
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
