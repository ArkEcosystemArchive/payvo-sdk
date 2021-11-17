import { HttpClient } from "../http";
import { IServiceProvider } from "../ioc";
import { CoinManifest, NetworkManifest } from "../networks/network.models";
import {
	AddressService,
	BigNumberService,
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
	address: AddressService;
	bigNumber: BigNumberService;
	client: ClientService;
	dataTransferObject: DataTransferObjectService;
	extendedAddress: ExtendedAddressService;
	fee: FeeService;
	keyPair: KeyPairService;
	knownWallets: KnownWalletService;
	ledger: LedgerService;
	link: LinkService;
	message: MessageService;
	multiSignature: MultiSignatureService;
	privateKey: PrivateKeyService;
	publicKey: PublicKeyService;
	signatory: SignatoryService;
	transaction: TransactionService;
	walletDiscovery: WalletDiscoveryService;
	wif: WIFService;
}

export interface CoinBundle {
	services: Record<string, object>; // @TODO: use CoinServices
	dataTransferObjects: object; // @TODO
	manifest: CoinManifest;
	serviceProvider?: any; // @TODO: use IServiceProvider
}
