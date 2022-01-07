import { Hash } from "@payvo/sdk-cryptography";
import { ISerializeOptions, ITransactionData } from "../interfaces";
import { Serializer } from "./serializer.js";
import { TransactionTypeFactory } from "./types/factory.js";

export class Utils {
	public static toBytes(data: ITransactionData): Buffer {
		return Serializer.serialize(TransactionTypeFactory.create(data));
	}

	public static toHash(transaction: ITransactionData, options?: ISerializeOptions): Buffer {
		return Hash.sha256(Serializer.getBytes(transaction, options));
	}

	public static getId(transaction: ITransactionData, options: ISerializeOptions = {}): string {
		return Utils.toHash(transaction, options).toString("hex");
	}
}
