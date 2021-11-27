import BtcLivenet from "./networks/btc.livenet";
import BtcTestnet from "./networks/btc.testnet.js";

export const manifest = {
	name: "BTC",
	networks: {
		"btc.livenet": BtcLivenet,
		"btc.testnet": BtcTestnet,
	},
};
