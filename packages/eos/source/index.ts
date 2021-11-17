import { bundle, Coins } from "@payvo/sdk";

import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { LedgerService } from "./ledger.service";
import { MessageService } from "./message.service";
import { PrivateKeyService } from "./private-key.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";
import { manifest } from "./manifest";

export const EOS: Coins.CoinBundle = bundle({
	dataTransferObjects: {
		SignedTransactionData,
		ConfirmedTransactionData,
		WalletData,
	},
	manifest,
	services: {
		address: AddressService,
		client: ClientService,
		ledger: LedgerService,
		message: MessageService,
		privateKey: PrivateKeyService,
		publicKey: PublicKeyService,
		transaction: TransactionService,
	},
});
