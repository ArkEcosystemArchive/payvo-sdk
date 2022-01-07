import { BigNumber } from "@payvo/sdk-helpers";

import {
	DuplicateParticipantInMultiSignatureError,
	InvalidTransactionBytesError,
	TransactionSchemaError,
	TransactionVersionError,
} from "../errors";
import { IDeserializeOptions, ITransaction, ITransactionData, ITransactionJson } from "../interfaces";
import { Deserializer } from "./deserializer.js";
import { Serializer } from "./serializer.js";
import { TransactionTypeFactory } from "./types/factory.js";
import { Utils } from "./utils.js";
import { Verifier } from "./verifier.js";

export class TransactionFactory {
	public static fromHex(hex: string): ITransaction {
		return this.fromSerialized(hex);
	}

	public static fromBytes(buffer: Buffer, strict = true, options: IDeserializeOptions = {}): ITransaction {
		return this.fromSerialized(buffer.toString("hex"), strict, options);
	}

	public static fromJson(json: ITransactionJson): ITransaction {
		const data: ITransactionData = { ...json } as unknown as ITransactionData;
		data.amount = BigNumber.make(data.amount);
		data.fee = BigNumber.make(data.fee);

		return this.fromData(data);
	}

	public static fromData(data: ITransactionData, strict = true, options: IDeserializeOptions = {}): ITransaction {
		const { value, error } = Verifier.verifySchema(data, strict);

		if (error) {
			throw new TransactionSchemaError(error);
		}

		const transaction: ITransaction = TransactionTypeFactory.create(value);

		Serializer.serialize(transaction);

		return this.fromBytes(transaction.serialized, strict, options);
	}

	private static fromSerialized(serialized: string, strict = true, options: IDeserializeOptions = {}): ITransaction {
		try {
			const transaction = Deserializer.deserialize(serialized, options);
			transaction.data.id = Utils.getId(transaction.data, options);

			const { error } = Verifier.verifySchema(transaction.data, strict);

			if (error) {
				throw new TransactionSchemaError(error);
			}

			transaction.isVerified = transaction.verify(options);

			return transaction;
		} catch (error) {
			if (
				error instanceof TransactionVersionError ||
				error instanceof TransactionSchemaError ||
				error instanceof DuplicateParticipantInMultiSignatureError
			) {
				throw error;
			}

			throw new InvalidTransactionBytesError(error.message);
		}
	}
}
