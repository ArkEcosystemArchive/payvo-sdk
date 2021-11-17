import { ConfirmedTransactionDataCollection } from "../collections/index.js";
import { SignedTransactionData, WalletData } from "../contracts.js";
import { ConfirmedTransactionData } from "../dto/confirmed-transaction.contract";
import { MetaPagination } from "./client.contract";

export interface DataTransferObjectService {
    signedTransaction(identifier: string, signedData: any, broadcastData?: any): SignedTransactionData;

    transaction(transaction: unknown): ConfirmedTransactionData;

    transactions(transactions: unknown[], meta: MetaPagination): ConfirmedTransactionDataCollection;

    wallet(wallet: unknown): WalletData;
}
