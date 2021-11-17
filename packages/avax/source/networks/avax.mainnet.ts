import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "Avalanche",
    constants: {
        slip44: 9000,
    },
    currency: {
        decimals: 9,
        symbol: "AVAX",
        ticker: "AVAX",
    },
    explorer,
    featureFlags,
    governance: {
        delegateCount: 0,
        method: "transfer",
        votesPerTransaction: 1,
        // @TODO
        votesPerWallet: 1,
    },
    hosts: [
        {
            host: "https://api.avax.network",
            type: "full",
        },
        {
            host: "https://avax-live.payvo.com",
            type: "archival",
        },
        {
            host: "https://explorer.avax.network",
            type: "explorer",
        },
    ],
    id: "avax.mainnet",
    importMethods,
    meta: {
        assetId: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z",

        blockchainId: "2oYMBNV4eNHyqk2fjjV5nVQLDbtmNJzq5s3qs3Lo6ftnC6FByM",
        // @TODO
        networkId: "1",
    },
    name: "Mainnet",
    transactions,
    type: "live",
};

export default network;
