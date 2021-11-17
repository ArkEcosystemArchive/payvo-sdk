import { bundle, Coins } from "@payvo/sdk";

import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { FeeService } from "./fee.service";
import { KeyPairService } from "./key-pair.service";
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

export const LSK: Coins.CoinBundle = bundle({
	dataTransferObjects: {
		SignedTransactionData,
		ConfirmedTransactionData,
		WalletData,
	},
	manifest,
	serviceProvider: ServiceProvider,
	services: {
		address: AddressService,
		client: ClientService,
		fee: FeeService,
		keyPair: KeyPairService,
		ledger: LedgerService,
		message: MessageService,
		multiSignature: MultiSignatureService,
		privateKey: PrivateKeyService,
		publicKey: PublicKeyService,
		transaction: TransactionService,
		wif: WIFService,
	},
});
