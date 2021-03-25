import { Coins, Contracts } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { ExtendedTransactionData } from "../../../dto/transaction";
import { ExtendedTransactionDataCollection } from "../../../dto/transaction-collection";
import { ReadOnlyWallet } from "../../memory/wallets/read-only-wallet";
import { TransactionService } from "../../memory/wallets/wallet-transaction-service";
import { IDataRepository } from "../repositories/data-repository";
import { IPeerRepository } from "../repositories/peer-repository";
import { ISettingRepository } from "../repositories/setting-repository";

export interface IWalletStruct {
	id: string;
	coin: string | undefined;
	network: string;
	networkConfig: {
		crypto: {
			slip44?: number;
		};
		networking: {
			hosts: string[];
			hostsMultiSignature: string[];
			hostsArchival: string[];
		};
	};
	address: string;
	publicKey: string | undefined;
	data: Record<string, any>;
	settings: Record<string, any>;
}

export interface IWallet {
    usesMultiPeerBroadcasting(): boolean;
    peers(): IPeerRepository;
    getRelays(): string[];
    setCoin(coin: string, network: string): Promise<IWallet>;
    setIdentity(mnemonic: string): Promise<IWallet>;
    setAddress(address: string, options: { syncIdentity: boolean; validate: boolean }): Promise<IWallet>;
    setAvatar(value: string): IWallet;
    setAlias(alias: string): IWallet;
    hasSyncedWithNetwork(): boolean;
    id(): string;
    coin(): Coins.Coin;
    network(): Coins.Network;
    currency(): string;
    exchangeCurrency(): string;
    alias(): string | undefined;
    displayName(): string | undefined;
    primaryKey(): string;
    address(): string;
    publicKey(): string | undefined;
    balance(): BigNumber;
    convertedBalance(): BigNumber;
    nonce(): BigNumber;
    avatar(): string;
    data(): IDataRepository;
    settings(): ISettingRepository;
    toData(): Contracts.WalletData;
    toObject(): IWalletStruct;
    knownName(): string | undefined;
    secondPublicKey(): string | undefined;
    username(): string | undefined;
    isDelegate(): boolean;
    isResignedDelegate(): boolean;
    isKnown(): boolean;
    isOwnedByExchange(): boolean;
    isOwnedByTeam(): boolean;
    isLedger(): boolean;
    isMultiSignature(): boolean;
    isSecondSignature(): boolean;
    isStarred(): boolean;
    toggleStarred(): void;
    coinId(): string;
    networkId(): string;
    manifest(): Coins.Manifest;
    config(): Coins.Config;
    client(): Contracts.ClientService;
    dataTransferObject(): Contracts.DataTransferObjectService;
    identity(): Contracts.IdentityService;
    ledger(): Contracts.LedgerService;
    link(): Contracts.LinkService;
    message(): Contracts.MessageService;
    peer(): Contracts.PeerService;
    transaction(): TransactionService;
    transactionTypes(): Coins.CoinTransactionTypes;
    transactions(query: Contracts.ClientTransactionsInput): Promise<ExtendedTransactionDataCollection>;
    sentTransactions(query: Contracts.ClientTransactionsInput): Promise<ExtendedTransactionDataCollection>;
    receivedTransactions(query: Contracts.ClientTransactionsInput): Promise<ExtendedTransactionDataCollection>;
    multiSignature(): Contracts.WalletMultiSignature;
    multiSignatureParticipants(): ReadOnlyWallet[];
    entities(): Contracts.Entity[];
    votes(): ReadOnlyWallet[];
    votesAvailable(): number;
    votesUsed(): number;
    explorerLink(): string;
    canVote(): boolean;
    can(feature: string): boolean;
    canAny(features: string[]): boolean;
    canAll(features: string[]): boolean;
    cannot(feature: string): boolean;
    sync(): Promise<void>;
    syncIdentity(): Promise<void>;
    syncMultiSignature(): Promise<void>;
    syncVotes(): Promise<void>;
    findTransactionById(id: string): Promise<ExtendedTransactionData>;
    findTransactionsByIds(ids: string[]): Promise<ExtendedTransactionData[]>;
    wif(password: string): Promise<string>;
    usesWIF(): boolean;
    markAsFullyRestored(): void;
    hasBeenFullyRestored(): boolean;
    markAsPartiallyRestored(): void;
    hasBeenPartiallyRestored(): boolean;
}

export interface IReadWriteWallet {
	usesMultiPeerBroadcasting(): boolean;
	peers(): IPeerRepository;
	getRelays(): string[];

	setCoin(coin: string, network: string): Promise<IReadWriteWallet>;
	setIdentity(mnemonic: string): Promise<IReadWriteWallet>;
	setAddress(address: string, options?: { syncIdentity: boolean; validate: boolean }): Promise<IReadWriteWallet>;
	setAlias(alias: string): IReadWriteWallet;
	setAvatar(value: string): IReadWriteWallet;

	hasSyncedWithNetwork(): boolean;

	id(): string;
	coin(): Coins.Coin;
	network(): Coins.Network;
	currency(): string;
	exchangeCurrency(): string;
	alias(): string | undefined;
	displayName(): string | undefined;
	primaryKey(): string;
	address(): string;
	publicKey(): string | undefined;
	balance(): BigNumber;
	convertedBalance(): BigNumber;
	nonce(): BigNumber;
	avatar(): string;
	data(): IDataRepository;
	settings(): ISettingRepository;
	toObject(): IWalletStruct;

	knownName(): string | undefined;
	secondPublicKey(): string | undefined;
	username(): string | undefined;

	isDelegate(): boolean;
	isResignedDelegate(): boolean;
	isKnown(): boolean;
	isOwnedByExchange(): boolean;
	isOwnedByTeam(): boolean;
	isLedger(): boolean;
	isMultiSignature(): boolean;
	isSecondSignature(): boolean;
	isStarred(): boolean;
	toggleStarred(): void;

	coinId(): string;
	networkId(): string;
	manifest(): Coins.Manifest;
	config(): Coins.Config;
	client(): Contracts.ClientService;
	dataTransferObject(): Contracts.DataTransferObjectService;
	identity(): Contracts.IdentityService;
	ledger(): Contracts.LedgerService;
	link(): Contracts.LinkService;
	message(): Contracts.MessageService;
	peer(): Contracts.PeerService;
	transaction(): TransactionService;

	transactionTypes(): Coins.CoinTransactionTypes;
	transactions(query: Contracts.ClientTransactionsInput): Promise<ExtendedTransactionDataCollection>;
	sentTransactions(query: Contracts.ClientTransactionsInput): Promise<ExtendedTransactionDataCollection>;
	receivedTransactions(query: Contracts.ClientTransactionsInput): Promise<ExtendedTransactionDataCollection>;
	findTransactionById(id: string): Promise<ExtendedTransactionData>;
	findTransactionsByIds(ids: string[]): Promise<ExtendedTransactionData[]>;

	multiSignature(): Contracts.WalletMultiSignature;
	multiSignatureParticipants(): ReadOnlyWallet[];

	entities(): Contracts.Entity[];

	votes(): ReadOnlyWallet[];
	votesAvailable(): number;
	votesUsed(): number;

	explorerLink(): string;

	canVote(): boolean;
	can(feature: string): boolean;
	canAny(features: string[]): boolean;
	canAll(features: string[]): boolean;
	cannot(feature: string): boolean;

	sync(): Promise<void>;
	syncIdentity(): Promise<void>;
	syncMultiSignature(): Promise<void>;
	syncVotes(): Promise<void>;

	markAsFullyRestored(): void;
	hasBeenFullyRestored(): boolean;
	markAsPartiallyRestored(): void;
	hasBeenPartiallyRestored(): boolean;

	usesWIF(): boolean;
	wif(password: string): Promise<string>;
}
