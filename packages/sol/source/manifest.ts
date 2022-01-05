import SolMainnet from "./networks/sol.mainnet.js";
import SolTestnet from "./networks/sol.testnet.js";

export const manifest = {
	name: "SOL",
	networks: {
		"sol.mainnet": SolMainnet,
		"sol.testnet": SolTestnet,
	},
};
