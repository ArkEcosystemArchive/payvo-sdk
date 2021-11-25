import { bundle, Coins } from "@payvo/sdk";

import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { KeyPairService } from "./key-pair.service.js";
import { LedgerService } from "./ledger.service.js";
import { manifest } from "./manifest.js";
import { MessageService } from "./message.service.js";
import { PrivateKeyService } from "./private-key.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { TransactionService } from "./transaction.service.js";
import { WalletData } from "./wallet.dto.js";

export const ATOM: Coins.CoinBundle = bundle({
	dataTransferObjects: {
		ConfirmedTransactionData,
		SignedTransactionData,
		WalletData,
	},
	manifest,
	services: {
		AddressService,
		ClientService,
		KeyPairService,
		LedgerService,
		MessageService,
		PrivateKeyService,
		PublicKeyService,
		TransactionService,
	},
});
