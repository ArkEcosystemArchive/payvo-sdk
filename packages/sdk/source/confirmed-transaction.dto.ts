/* istanbul ignore file */
/* eslint-disable */

import { BigNumber, Censor } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";
import emoji from "node-emoji";

import { KeyValuePair } from "./contracts.js";
import { NotImplemented } from "./exceptions.js";
import { BindingType } from "./service-provider.contract.js";
import {
	ConfirmedTransactionData,
	MultiPaymentRecipient,
	TransactionDataMeta,
	UnspentTransactionData,
} from "./confirmed-transaction.dto.contract.js";
import { IContainer } from "./container.contracts.js";

export abstract class AbstractConfirmedTransactionData implements ConfirmedTransactionData {
	/**
	 * Various coins need post-processing to determine things like
	 * "isSent" or "isReceived" with data that comes from outside
	 * of the transaction or network data itself. This object can
	 * be used to store the data necessary for those actions.
	 */
	readonly #meta: Record<string, TransactionDataMeta> = {};

	readonly #types = {
		delegateRegistration: "isDelegateRegistration",
		delegateResignation: "isDelegateResignation",
		htlcClaim: "isHtlcClaim",
		htlcLock: "isHtlcLock",
		htlcRefund: "isHtlcRefund",
		ipfs: "isIpfs",
		magistrate: "isMagistrate",
		multiPayment: "isMultiPayment",
		multiSignature: "isMultiSignatureRegistration",
		secondSignature: "isSecondSignature",
		transfer: "isTransfer",
		unlockToken: "isUnlockToken",
		unvote: "isUnvote",
		vote: "isVote",
		voteCombination: "isVoteCombination",
	};

	protected decimals?: number;

	protected data!: KeyValuePair;

	protected readonly bigNumberService: any; // @TODO: import BigNumberService causes a circular dependency

	public constructor(container: IContainer) {
		this.bigNumberService = container.get(BindingType.BigNumberService);
	}

	public configure(data: any) {
		this.data = data;

		return this;
	}

	public withDecimals(decimals?: number | string): this {
		this.decimals = typeof decimals === "string" ? Number.parseInt(decimals) : decimals;

		return this;
	}

	public id(): string {
		throw new NotImplemented(this.constructor.name, this.id.name);
	}

	public blockId(): string | undefined {
		return undefined;
	}

	public type(): string {
		if (this.isVoteCombination()) {
			return "voteCombination";
		}

		for (const [type, method] of Object.entries(this.#types)) {
			if (type === "voteCombination") {
				continue;
			}

			if (this[method]()) {
				return type;
			}
		}

		return "transfer";
	}

	public timestamp(): DateTime | undefined {
		return undefined;
	}

	public confirmations(): BigNumber {
		return BigNumber.ZERO;
	}

	public sender(): string {
		throw new NotImplemented(this.constructor.name, this.sender.name);
	}

	public senders(): MultiPaymentRecipient[] {
		return [];
	}

	public recipient(): string {
		throw new NotImplemented(this.constructor.name, this.recipient.name);
	}

	public recipients(): MultiPaymentRecipient[] {
		return [];
	}

	public amount(): BigNumber {
		throw new NotImplemented(this.constructor.name, this.amount.name);
	}

	public fee(): BigNumber {
		throw new NotImplemented(this.constructor.name, this.fee.name);
	}

	public memo(): string | undefined {
		return undefined;
	}

	public asset(): Record<string, unknown> {
		return {};
	}

	public inputs(): UnspentTransactionData[] {
		return [];
	}

	public outputs(): UnspentTransactionData[] {
		return [];
	}

	public isConfirmed(): boolean {
		return this.confirmations().isGreaterThanOrEqualTo(1);
	}

	public isReturn(): boolean {
		return this.isSent() && this.isReceived();
	}

	public isSent(): boolean {
		return false;
	}

	public isReceived(): boolean {
		return false;
	}

	public isTransfer(): boolean {
		return true;
	}

	public isSecondSignature(): boolean {
		return false;
	}

	public isDelegateRegistration(): boolean {
		return false;
	}

	public isVoteCombination(): boolean {
		return false;
	}

	public isVote(): boolean {
		return false;
	}

	public isUnvote(): boolean {
		return false;
	}

	public isMultiSignatureRegistration(): boolean {
		return false;
	}

	public isIpfs(): boolean {
		return false;
	}

	public isMultiPayment(): boolean {
		return false;
	}

	public isDelegateResignation(): boolean {
		return false;
	}

	public isHtlcLock(): boolean {
		return false;
	}

	public isHtlcClaim(): boolean {
		return false;
	}

	public isHtlcRefund(): boolean {
		return false;
	}

	public isMagistrate(): boolean {
		return false;
	}

	public isUnlockToken(): boolean {
		return false;
	}

	// Second-Signature Registration
	public secondPublicKey(): string {
		throw new NotImplemented(this.constructor.name, this.secondPublicKey.name);
	}

	// Delegate Registration
	public username(): string {
		throw new NotImplemented(this.constructor.name, this.username.name);
	}

	// Vote
	public votes(): string[] {
		throw new NotImplemented(this.constructor.name, this.votes.name);
	}

	public unvotes(): string[] {
		throw new NotImplemented(this.constructor.name, this.unvotes.name);
	}

	// Multi-Signature Registration
	public publicKeys(): string[] {
		throw new NotImplemented(this.constructor.name, this.publicKeys.name);
	}

	public min(): number {
		throw new NotImplemented(this.constructor.name, this.min.name);
	}

	// IPFS
	public hash(): string {
		throw new NotImplemented(this.constructor.name, this.hash.name);
	}

	// Multi-Payment
	public payments(): { recipientId: string; amount: BigNumber }[] {
		throw new NotImplemented(this.constructor.name, this.payments.name);
	}

	// HTLC Claim / Refund
	public lockTransactionId(): string {
		throw new NotImplemented(this.constructor.name, this.lockTransactionId.name);
	}

	// HTLC Claim
	public unlockSecret(): string {
		throw new NotImplemented(this.constructor.name, this.unlockSecret.name);
	}

	// HTLC Lock
	public secretHash(): string {
		throw new NotImplemented(this.constructor.name, this.secretHash.name);
	}

	public expirationType(): number {
		throw new NotImplemented(this.constructor.name, this.expirationType.name);
	}

	public expirationValue(): number {
		throw new NotImplemented(this.constructor.name, this.expirationValue.name);
	}

	public toObject(): KeyValuePair {
		return {
			amount: this.amount(),
			asset: this.asset(),
			confirmations: this.confirmations(),
			fee: this.fee(),
			id: this.id(),
			recipient: this.recipient(),
			sender: this.sender(),
			timestamp: this.timestamp(),
			type: this.type(),
		};
	}

	public toJSON(): KeyValuePair {
		return {
			...this.toObject(),
			amount: this.amount().toString(),
			confirmations: this.confirmations().toString(),
			fee: this.fee().toString(),
			timestamp: this.timestamp()?.toISOString(),
		};
	}

	public toHuman(): KeyValuePair {
		return {
			...this.toObject(),
			amount: this.amount().toHuman(),
			confirmations: this.confirmations().toString(),
			fee: this.fee().toHuman(),
			timestamp: this.timestamp()?.toISOString(),
		};
	}

	public raw(): KeyValuePair {
		return this.data;
	}

	public hasPassed(): boolean {
		return Object.keys(this.data).length > 0;
	}

	public hasFailed(): boolean {
		return !this.hasPassed();
	}

	public getMeta(key: string): TransactionDataMeta {
		return this.#meta[key];
	}

	public setMeta(key: string, value: TransactionDataMeta): void {
		this.#meta[key] = value;
	}

	protected censorMemo(memo?: string): string | undefined {
		if (!memo || memo.length <= 0) {
			return undefined;
		}

		const processor: Censor = new Censor();

		if (processor.isBad(memo)) {
			return undefined;
		}

		return processor.process(emoji.emojify(memo));
	}
}
