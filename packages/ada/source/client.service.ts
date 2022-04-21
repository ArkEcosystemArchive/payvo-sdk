import { Collections, Contracts, Exceptions, Services } from "@payvo/sdk";

import { fetchTransaction, fetchTransactions, fetchUtxosAggregate, submitTransaction } from "./graphql-helpers.js";
import { usedAddressesForAccount } from "./transaction.domain.js";

export class ClientService extends Services.AbstractClientService {
	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		return this.dataTransferObjectService.transaction(
			await fetchTransaction(id, this.configRepository, this.httpClient, this.hostSelector),
		);
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		if (query.senderPublicKey === undefined) {
			throw new Exceptions.MissingArgument(this.constructor.name, this.transactions.name, "senderPublicKey");
		}

		const { usedSpendAddresses, usedChangeAddresses } = await usedAddressesForAccount(
			this.configRepository,
			this.httpClient,
			this.hostSelector,
			query.senderPublicKey,
		);

		const transactions = await fetchTransactions(this.configRepository, this.httpClient, this.hostSelector, [
			...usedSpendAddresses.values(),
			...usedChangeAddresses.values(),
		]);

		return this.dataTransferObjectService.transactions(transactions, {
			last: undefined,
			next: undefined,
			prev: undefined,
			self: undefined,
		});
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		const { usedSpendAddresses, usedChangeAddresses } = await usedAddressesForAccount(
			this.configRepository,
			this.httpClient,
			this.hostSelector,
			id.value,
		);

		const balance = await fetchUtxosAggregate(this.configRepository, this.httpClient, this.hostSelector, [
			...usedSpendAddresses.values(),
			...usedChangeAddresses.values(),
		]);

		return this.dataTransferObjectService.wallet({
			balance,
			id: id.value,
		});
	}

	public override async broadcast(
		transactions: Contracts.SignedTransactionData[],
	): Promise<Services.BroadcastResponse> {
		const result: Services.BroadcastResponse = {
			accepted: [],
			errors: {},
			rejected: [],
		};

		for (const transaction of transactions) {
			try {
				await submitTransaction(
					this.configRepository,
					this.httpClient,
					this.hostSelector,
					transaction.toBroadcast(),
				);

				result.accepted.push(transaction.id());
			} catch (error) {
				result.rejected.push(transaction.id());

				result.errors[transaction.id()] = (error as any).message;
			}
		}

		return result;
	}
}
