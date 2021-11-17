import { Networks } from "@payvo/sdk";

import { assets, explorer, featureFlags, governance, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "Lisk",
    constants: {
        slip44: 134,
    },
    currency: {
        decimals: 8,
        symbol: "LSK",
        ticker: "LSK",
    },
    explorer,
    featureFlags,
    governance,
    hosts: [
        {
            host: "https://lsk-live.payvo.com/api/v2",
            type: "full",
        },
        {
            host: "https://lsk-live-musig.payvo.com",
            type: "musig",
        },
        {
            host: "https://lisk.observer",
            type: "explorer",
        },
    ],
    id: "lsk.mainnet",
    importMethods,
    meta: {
        assets,
        networkId: "4c09e6a781fc4c7bdb936ee815de8f94190f8a7519becd9de2081832be309a99",
    },
    name: "Mainnet",
    transactions,
    type: "live",
};

export default network;
