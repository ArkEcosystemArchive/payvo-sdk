import { HttpClient } from "../http";
import { CoinManifest, NetworkManifest } from "../networks/network.models";
import {
	AddressService,
	ClientService,
	DataTransferObjectService,
	ExtendedAddressService,
	FeeService,
	KeyPairService,
	KnownWalletService,
	LedgerService,
	LedgerTransportFactory,
	LinkService,
	MessageService,
	MultiSignatureService,
	PrivateKeyService,
	PublicKeyService,
	SignatoryService,
	TransactionService,
	WalletDiscoveryService,
	WIFService,
} from "../services";
import { BigNumberService } from "../services/big-number.service";

export interface CoinSpec {
	manifest: CoinManifest;
	ServiceProvider: any;
	dataTransferObjects: Record<string, any>;
}

export interface CoinOptions {
	network: string;
	networks?: Record<string, NetworkManifest>;
	httpClient: HttpClient;
	ledgerTransportFactory?: LedgerTransportFactory;
}

export interface CoinServices {
	bigNumber: BigNumberService;
	client: ClientService;
	dataTransferObject: DataTransferObjectService;
	fee: FeeService;
	address: AddressService;
	extendedAddress: ExtendedAddressService;
	keyPair: KeyPairService;
	privateKey: PrivateKeyService;
	publicKey: PublicKeyService;
	wif: WIFService;
	knownWallets: KnownWalletService;
	ledger: LedgerService;
	link: LinkService;
	message: MessageService;
	multiSignature: MultiSignatureService;
	signatory: SignatoryService;
	transaction: TransactionService;
	walletDiscovery: WalletDiscoveryService;
}

export interface CoinBundle {
	services: CoinManifest;
	dataTransferObjects: object; // @TODO
	manifest: CoinManifest;
	serviceProvider: CoinServices;
}
