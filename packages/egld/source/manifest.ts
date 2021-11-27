import ElrondMainnet from "./networks/egld.mainnet.js";
import ElrondTestnet from "./networks/egld.testnet.js";

export const manifest = {
	name: "EGLD",
	networks: {
		"egld.mainnet": ElrondMainnet,
		"egld.testnet": ElrondTestnet,
	},
};
