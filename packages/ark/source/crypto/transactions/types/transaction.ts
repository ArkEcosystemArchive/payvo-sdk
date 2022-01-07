import ByteBuffer from "bytebuffer";

import { TransactionTypeGroup } from "../../enums";
import { NotImplemented } from "../../errors";
import { Address } from "../../identities/address.js";
import {
	ISchemaValidationResult,
	ISerializeOptions,
	ITransaction,
	ITransactionData,
	ITransactionJson,
} from "../../interfaces";
import { configManager } from "../../managers/config";
import { BigNumber } from "@payvo/sdk-helpers";
import { Verifier } from "../verifier.js";
import { TransactionSchema } from "./schemas";

export abstract class Transaction implements ITransaction {
	public static type: number | undefined = undefined;
	public static typeGroup: number | undefined = undefined;
	public static version: number = 2;
	public static key: string | undefined = undefined;

	protected static defaultStaticFee: BigNumber = BigNumber.ZERO;

	public isVerified: boolean = false;
	public data!: ITransactionData;
	public serialized!: Buffer;
	public timestamp!: number;

	public static getSchema(): TransactionSchema {
		throw new NotImplemented();
	}

	public static staticFee(feeContext: { height?: number; data?: ITransactionData } = {}): BigNumber {
		const milestones = configManager.getMilestone(feeContext.height);

		if (milestones.fees && milestones.fees.staticFees && this.key) {
			const fee: any = milestones.fees.staticFees[this.key];

			if (fee !== undefined) {
				return BigNumber.make(fee);
			}
		}

		return this.defaultStaticFee;
	}

	public verify(options?: ISerializeOptions): boolean {
		return Verifier.verify(this.data, options);
	}

	public verifySecondSignature(publicKey: string): boolean {
		return Verifier.verifySecondSignature(this.data, publicKey);
	}

	public verifySchema(): ISchemaValidationResult {
		return Verifier.verifySchema(this.data);
	}

	public toJson(): ITransactionJson {
		const normalisedData = {};

		for (const [key, value] of Object.entries(this.data)) {
			if (value instanceof BigNumber) {
				normalisedData[key] = value.toString();
			} else {
				normalisedData[key] = value;
			}

			if (this.data.asset?.payments) {
				for (const payment of this.data.asset?.payments) {
					// @ts-ignore
					payment.amount = payment.amount.toString();
				}
			}
		}

		const data: ITransactionJson = JSON.parse(JSON.stringify(normalisedData));

		if (data.typeGroup === TransactionTypeGroup.Core) {
			delete data.typeGroup;
		}

		delete data.timestamp;

		return data;
	}

	public toString(): string {
		const parts: string[] = [];

		if (this.data.senderPublicKey && this.data.nonce) {
			parts.push(`${Address.fromPublicKey(this.data.senderPublicKey)}#${this.data.nonce}`);
		} else if (this.data.senderPublicKey) {
			parts.push(`${Address.fromPublicKey(this.data.senderPublicKey)}`);
		}

		if (this.data.id) {
			parts.push(this.data.id.slice(-8));
		}

		parts.push(`${this.key[0].toUpperCase()}${this.key.slice(1)} v${this.data.version}`);

		return parts.join(" ");
	}

	public hasVendorField(): boolean {
		return false;
	}

	public abstract serialize(): ByteBuffer | undefined;
	public abstract deserialize(buf: ByteBuffer): void;

	public get id(): string | undefined {
		return this.data.id;
	}

	public get type(): number {
		return this.data.type;
	}

	public get typeGroup(): number | undefined {
		return this.data.typeGroup;
	}

	public get verified(): boolean {
		return this.isVerified;
	}

	public get key(): string {
		return (this as any).__proto__.constructor.key;
	}

	public get staticFee(): BigNumber {
		return (this as any).__proto__.constructor.staticFee({ data: this.data });
	}
}
