import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "Zilliqa",
    constants: {
        slip44: 313,
    },
    currency: {
        decimals: 12,
        symbol: "ZIL",
        ticker: "ZIL",
    },
    explorer,
    featureFlags,
    hosts: [
        {
            host: "https://api.zilliqa.com",
            type: "full",
        },
        {
            host: "https://viewblock.io/zilliqa",
            type: "explorer",
        },
    ],
    id: "zil.mainnet",
    importMethods,
    name: "Mainnet",
    transactions,
    type: "live",
};

export default network;
