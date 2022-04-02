import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";

import { MultiPaymentRecipient } from "./confirmed-transaction.dto.contract.js";

export type RawTransactionData = any;

export interface SignedTransactionObject {
	id: string;
	sender: string;
	recipient: string;
	amount: string;
	fee: string;
	timestamp: string;
	data: RawTransactionData;
	broadcast: any;
}

export interface SignedTransactionData {
	setAttributes(attributes: { identifier: string }): void;

	configure(identifier: string, signedData: RawTransactionData, broadcastData?: any, decimals?: number | string);

	// All
	id(): string;
	data(): RawTransactionData;
	sender(): string;
	recipient(): string;
	amount(): BigNumber;
	fee(): BigNumber;
	memo(): string | undefined;
	timestamp(): DateTime;

	// Types
	isTransfer(): boolean;
	isSecondSignature(): boolean;
	isDelegateRegistration(): boolean;
	isVoteCombination(): boolean;
	isVote(): boolean;
	isUnvote(): boolean;
	isMultiSignatureRegistration(): boolean;
	isIpfs(): boolean;
	isMultiPayment(): boolean;
	isDelegateResignation(): boolean;
	isHtlcLock(): boolean;
	isHtlcClaim(): boolean;
	isHtlcRefund(): boolean;
	isMagistrate(): boolean;
	isUnlockToken(): boolean;

	// Indicates if the transaction has been signed with a multi-signature.
	usesMultiSignature(): boolean;

	// Access & serialization
	get<T = string>(key: string): T;
	toString(): string;
	toBroadcast(): any;
	toSignedData(): any;
	toObject(): SignedTransactionObject;
	type(): string;

	// @TODO: remove those after introducing proper signed tx DTOs
	username(): string;
	hash(): string;
	recipients(): MultiPaymentRecipient[];
}
