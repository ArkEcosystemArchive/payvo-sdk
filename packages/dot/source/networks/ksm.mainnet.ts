import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "Kusama",
    constants: {
        slip44: 434,
    },
    currency: {
        decimals: 12,
        symbol: "KSM",
        ticker: "KSM",
    },
    explorer,
    featureFlags,
    hosts: [
        {
            host: "https://kusama-rpc.polkadot.io/",
            type: "full",
        },
        {
            host: "https://polkascan.io/kusama",
            type: "explorer",
        },
    ],
    id: "ksm.mainnet",
    importMethods,
    meta: {
        networkId: "2",
    },
    name: "Mainnet",
    transactions: {
        ...transactions,
        fees: {
            ticker: "KSM",
            type: "weight",
        },
    },
    type: "live",
};

export default network;
