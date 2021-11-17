import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "MEET.ONE",
    constants: {
        bech32: "MEETONE",
        slip44: 194,
    },
    currency: {
        decimals: 4,
        symbol: "MEETONE",
        ticker: "MEETONE",
    },
    explorer,
    featureFlags,
    hosts: [
        {
            host: "https://fullnode.meet.one",
            type: "full",
        },
        {
            host: "https://meetone.bloks.io",
            type: "explorer",
        },
    ],
    id: "meetone.mainnet",
    importMethods,
    meta: {
        // @TODO
        networkId: "cfe6486a83bad4962f232d48003b1824ab5665c36778141034d75e57b956e422",
    },
    name: "Mainnet",
    transactions: {
        ...transactions,
        fees: {
            ticker: "MEETONE",
            type: "free",
        },
    },
    type: "live",
};

export default network;
