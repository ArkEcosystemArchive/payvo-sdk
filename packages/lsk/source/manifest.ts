import LskMainnet from "./networks/lsk.mainnet.js";
import LskTestnet from "./networks/lsk.testnet.js";

export const manifest = {
	name: "LSK",
	networks: {
		"lsk.mainnet": LskMainnet,
		"lsk.testnet": LskTestnet,
	},
};
