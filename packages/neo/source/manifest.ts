import NeoMainnet from "./networks/neo.mainnet.js";
import NeoTestnet from "./networks/neo.testnet.js";

export const manifest = {
	name: "NEO",
	networks: {
		"neo.mainnet": NeoMainnet,
		"neo.testnet": NeoTestnet,
	},
};
