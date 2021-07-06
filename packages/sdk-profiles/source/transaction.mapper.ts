import { Collections, Contracts } from "@payvo/sdk";

import { IReadWriteWallet } from "./contracts";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";
import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection";

export const transformTransactionData = (
	wallet: IReadWriteWallet,
	transaction: Contracts.ConfirmedTransactionData,
): ExtendedConfirmedTransactionData => new ExtendedConfirmedTransactionData(wallet, transaction);

export const transformConfirmedTransactionDataCollection = (
	wallet: IReadWriteWallet,
	transactions: Collections.ConfirmedTransactionDataCollection,
): ExtendedConfirmedTransactionDataCollection =>
	new ExtendedConfirmedTransactionDataCollection(
		transactions
			.getData()
			.map((transaction: Contracts.ConfirmedTransactionData) => transformTransactionData(wallet, transaction)),
		transactions.getPagination(),
	);
