import { MetaPagination } from "./client.contract.js";
import { ConfirmedTransactionDataCollection } from "./collections.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.contract.js";
import { SignedTransactionData, WalletData } from "./contracts.js";

export interface DataTransferObjectService {
	signedTransaction(identifier: string, signedData: any, broadcastData?: any): SignedTransactionData;

	transaction(transaction: unknown): ConfirmedTransactionData;

	transactions(transactions: unknown[], meta: MetaPagination): ConfirmedTransactionDataCollection;

	wallet(wallet: unknown): WalletData;
}
