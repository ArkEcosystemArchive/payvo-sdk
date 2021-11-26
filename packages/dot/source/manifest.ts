import DotMainnet from "./networks/dot.mainnet.js";
import KsmMainnet from "./networks/ksm.mainnet.js";

export const manifest = {
	name: "DOT",
	networks: {
		"dot.mainnet": DotMainnet,
		"ksm.mainnet": KsmMainnet,
	},
};
