import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
    coin: "Telos",
    constants: {
        bech32: "TLOS",
        slip44: 194,
    },
    currency: {
        decimals: 4,
        symbol: "TLOS",
        ticker: "TLOS",
    },
    explorer,
    featureFlags,
    hosts: [
        {
            host: "https://telos-testnet.eosblocksmith.io",
            type: "full",
        },
        {
            host: "https://api.eos.miami",
            type: "full",
        },
        {
            host: "https://testnet.telos.caleos.io",
            type: "full",
        },
        {
            host: "https://api-test.telosfoundation.io",
            type: "full",
        },
        {
            host: "https://telos-test.bloks.io",
            type: "explorer",
        },
    ],
    id: "telos.testnet",
    importMethods,
    meta: {
        // @TODO
        networkId: "e17615decaecd202a365f4c029f206eee98511979de8a5756317e2469f2289e3",
    },
    name: "Testnet",
    transactions: {
        ...transactions,
        fees: {
            ticker: "TLOS",
            type: "free",
        },
    },
    type: "test",
};

export default network;
