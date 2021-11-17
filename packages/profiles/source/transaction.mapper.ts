import { Collections, Contracts } from "@payvo/sdk";

import { IReadWriteWallet } from "./contracts.js";
import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";

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
            .items()
            .map((transaction: Contracts.ConfirmedTransactionData) => transformTransactionData(wallet, transaction)),
        transactions.getPagination(),
    );
