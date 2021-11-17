import { BigNumber } from "@payvo/sdk-helpers";
import { RawTransactionData, SignedTransactionData } from "./dto/signed-transaction.contract.js";
import {
	UnspentTransactionData,
	ConfirmedTransactionData,
	MultiPaymentRecipient,
	TransactionDataMeta,
} from "./dto/confirmed-transaction.contract.js";

export type KeyValuePair = Record<string, any>;

export interface WalletBalance {
	total: BigNumber;
	available: BigNumber;
	fees: BigNumber;
	locked?: BigNumber;
	lockedVotes?: BigNumber;
	lockedUnvotes?: BigNumber;
	tokens?: Record<string, BigNumber>;
}

export interface WalletMultiSignature {
	// Standard
	min?: number;
	publicKeys?: string[];
	limit?: number;
	// Advanced
	mandatoryKeys?: string[];
	numberOfSignatures?: number;
	optionalKeys?: string[];
}

export interface WalletData {
	fill(data: any): WalletData;

	// Wallet
	primaryKey(): string;

	address(): string;

	publicKey(): string | undefined;

	balance(): WalletBalance;

	nonce(): BigNumber;

	// Second Signature
	secondPublicKey(): string | undefined;

	// Delegate
	username(): string | undefined;

	rank(): number | undefined;

	votes(): BigNumber | undefined;

	multiSignature(): WalletMultiSignature;

	// Flags
	isDelegate(): boolean;

	isResignedDelegate(): boolean;

	isMultiSignature(): boolean;

	isSecondSignature(): boolean;

	toObject(): KeyValuePair;

	hasPassed(): boolean;

	hasFailed(): boolean;
}

type LedgerTransport = any;

// @TODO: export those directly from the files and get rid of this whole file
export {
	ConfirmedTransactionData,
	LedgerTransport,
	MultiPaymentRecipient,
	RawTransactionData,
	SignedTransactionData,
	TransactionDataMeta,
	UnspentTransactionData,
};
