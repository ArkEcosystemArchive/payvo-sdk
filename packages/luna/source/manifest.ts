import LunaMainnet from "./networks/luna.mainnet.js";
import LunaTestnet from "./networks/luna.testnet.js";

export const manifest = {
	name: "LUNA",
	networks: {
		"luna.mainnet": LunaMainnet,
		"luna.testnet": LunaTestnet,
	},
};
