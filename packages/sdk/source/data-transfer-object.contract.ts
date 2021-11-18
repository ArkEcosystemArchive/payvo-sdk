import { ConfirmedTransactionDataCollection } from "./collections.js";
import { SignedTransactionData, WalletData } from "./contracts.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.contract.js";
import { MetaPagination } from "./client.contract.js";

export interface DataTransferObjectService {
	signedTransaction(identifier: string, signedData: any, broadcastData?: any): SignedTransactionData;

	transaction(transaction: unknown): ConfirmedTransactionData;

	transactions(transactions: unknown[], meta: MetaPagination): ConfirmedTransactionDataCollection;

	wallet(wallet: unknown): WalletData;
}
