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
            host: "https://apinode.telosgermany.io",
            type: "full",
        },
        {
            host: "https://api.telosfoundation.io",
            type: "full",
        },
        {
            host: "https://telos-mainnet.eosblocksmith.io",
            type: "full",
        },
        {
            host: "https://telos.caleos.io",
            type: "full",
        },
        {
            host: "https://telos.bloks.io",
            type: "explorer",
        },
    ],
    id: "telos.mainnet",
    importMethods,
    meta: {
        // @TODO
        networkId: "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
    },
    name: "Mainnet",
    transactions: {
        ...transactions,
        fees: {
            ticker: "TLOS",
            type: "free",
        },
    },
    type: "live",
};

export default network;
