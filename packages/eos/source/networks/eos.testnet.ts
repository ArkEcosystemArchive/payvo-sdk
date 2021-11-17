import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "EOS",
    constants: {
        bech32: "EOS",
        slip44: 194,
    },
    currency: {
        decimals: 4,
        symbol: "EOS",
        ticker: "EOS",
    },
    explorer,
    featureFlags,
    hosts: [
        {
            host: "https://api.testnet.eos.io",
            type: "full",
        },
        {
            host: "https://eos-test.bloks.io",
            type: "explorer",
        },
    ],
    id: "eos.testnet",
    importMethods,
    meta: {
        // @TODO
        networkId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473",
    },
    name: "Testnet",
    transactions,
    type: "test",
};

export default network;
