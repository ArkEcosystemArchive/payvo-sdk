import { bundle, Coins } from "@payvo/sdk";

import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { FeeService } from "./fee.service";
import { KeyPairService } from "./key-pair.service";
import { KnownWalletService } from "./known-wallet.service";
import { LedgerService } from "./ledger.service";
import { MessageService } from "./message.service";
import { MultiSignatureService } from "./multi-signature.service";
import { PrivateKeyService } from "./private-key.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { WIFService } from "./wif.service";
import { manifest } from "./manifest";
import { ServiceProvider } from "./coin.provider";

export const ARK: Coins.CoinBundle = bundle({
	dataTransferObjects: {
		SignedTransactionData,
		ConfirmedTransactionData,
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
		PublicKeyService,
		TransactionService,
		WIFService,
	},
});
