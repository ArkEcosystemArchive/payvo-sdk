import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "Elrond",
    constants: {
        slip44: 508,
    },
    currency: {
        decimals: 18,
        symbol: "XeGLD",
        ticker: "XeGLD",
    },
    explorer,
    featureFlags,
    hosts: [
        {
            host: "https://testnet-gateway.elrond.com",
            type: "full",
        },
        {
            host: "https://testnet-explorer.elrond.com",
            type: "explorer",
        },
    ],
    id: "egld.testnet",
    importMethods,
    name: "Testnet",
    transactions: {
        ...transactions,
        fees: {
            ticker: "XeGLD",
            type: "static",
        },
    },
    type: "test",
};

export default network;
