import { bundle, Coins } from "@payvo/sdk";

import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { FeeService } from "./fee.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { LedgerService } from "./ledger.service.js";
import { MessageService } from "./message.service.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { PrivateKeyService } from "./private-key.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { TransactionService } from "./transaction.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";
import { WIFService } from "./wif.service.js";
import { manifest } from "./manifest.js";

export const LSK: Coins.CoinBundle = bundle({
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
		MessageService,
		MultiSignatureService,
		PrivateKeyService,
		PublicKeyService,
		TransactionService,
		WIFService,
	},
});
