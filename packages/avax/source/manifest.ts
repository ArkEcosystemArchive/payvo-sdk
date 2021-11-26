import AvaxMainnet from "./networks/avax.mainnet.js";
import AvaxTestnet from "./networks/avax.testnet.js";

export const manifest = {
	name: "AVAX",
	networks: {
		"avax.mainnet": AvaxMainnet,
		"avax.testnet": AvaxTestnet,
	},
};
