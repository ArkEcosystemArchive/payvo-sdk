import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "Solana",
    constants: {
        slip44: 501,
    },
    currency: {
        decimals: 9,
        symbol: "SOL",
        ticker: "SOL",
    },
    explorer,
    featureFlags,
    hosts: [
        {
            host: "https://api.mainnet-beta.solana.com",
            type: "full",
        },
        {
            host: "https://explorer.solana.com",
            type: "explorer",
        },
    ],
    id: "sol.mainnet",
    importMethods,
    name: "Mainnet",
    transactions,
    type: "live",
};

export default network;
