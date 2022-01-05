import AtomMainnet from "./networks/atom.mainnet.js";
import AtomTestnet from "./networks/atom.testnet.js";

export const manifest = {
	name: "ATOM",
	networks: {
		"atom.mainnet": AtomMainnet,
		"atom.testnet": AtomTestnet,
	},
};
