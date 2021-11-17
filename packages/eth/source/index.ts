import { bundle, Coins } from "@payvo/sdk";

import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { FeeService } from "./fee.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PrivateKeyService } from "./private-key.service";
import { TransactionService } from "./transaction.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { manifest } from "./manifest.js";

export const ETH: Coins.CoinBundle = bundle({
    dataTransferObjects: {
        SignedTransactionData,
        ConfirmedTransactionData,
        WalletData,
    },
    manifest,
    services: {
        AddressService,
        ClientService,
        FeeService,
        KeyPairService,
        LedgerService,
        PrivateKeyService,
        TransactionService,
    },
});
