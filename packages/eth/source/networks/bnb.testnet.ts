import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "Binance",
    constants: {
        slip44: 714,
    },
    currency: {
        decimals: 18,
        symbol: "BNB",
        ticker: "BNB",
    },
    explorer,
    featureFlags,
    hosts: [
        {
            host: "https://data-seed-prebsc-1-s1.binance.org:8545",
            type: "full",
        },
        {
            host: "https://binance.mintscan.io",
            type: "explorer",
        },
    ],
    id: "bnb.testnet",
    importMethods,
    name: "Testnet",
    transactions,
    type: "test",
};

export default network;
