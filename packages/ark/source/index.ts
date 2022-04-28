import { bundle, Coins } from "@payvo/sdk";

import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { ServiceProvider } from "./coin.provider.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { FeeService } from "./fee.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { KnownWalletService } from "./known-wallet.service.js";
import { LedgerService } from "./ledger.service.js";
import { manifest } from "./manifest.js";
import { MessageService } from "./message.service.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { PrivateKeyService } from "./private-key.service.js";
import { ProberService } from "./prober.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { TransactionService } from "./transaction.service.js";
import { WalletData } from "./wallet.dto.js";
import { WIFService } from "./wif.service.js";

export const ARK: Coins.CoinBundle = bundle({
	dataTransferObjects: {
		ConfirmedTransactionData,
		SignedTransactionData,
		WalletData,
	},
	manifest,
	serviceProvider: ServiceProvider,
	services: {
		AddressService,
		ClientService,
		FeeService,
		KeyPairService,
		KnownWalletService,
		LedgerService,
		MessageService,
		MultiSignatureService,
		PrivateKeyService,
		ProberService,
		PublicKeyService,
		TransactionService,
		WIFService,
	},
});
