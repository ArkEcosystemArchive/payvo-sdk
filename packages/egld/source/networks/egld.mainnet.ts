import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "Elrond",
    constants: {
        slip44: 508,
    },
    currency: {
        decimals: 18,
        symbol: "EGLD",
        ticker: "EGLD",
    },
    explorer,
    featureFlags,
    hosts: [
        {
            host: "https://gateway.elrond.com",
            type: "full",
        },
        {
            host: "https://explorer.elrond.com",
            type: "explorer",
        },
    ],
    id: "egld.mainnet",
    importMethods,
    name: "Mainnet",
    transactions,
    type: "live",
};

export default network;
