import { Collections, Contracts, Helpers, IoC, Services } from "@payvo/sdk";
import { UUID } from "@payvo/sdk-cryptography";

export class ClientService extends Services.AbstractClientService {
	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		const transaction = await this.#post("tx", [
			{
				transaction: id,
				binary: false,
			},
		]);

		return this.dataTransferObjectService.transaction(transaction);
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		const { transactions } = await this.#post("account_tx", [
			{
				account: query.identifiers![0].value,
				limit: query.limit || 15,
			},
		]);

		return this.dataTransferObjectService.transactions(
			transactions.map(({ tx }) => tx),
			{
				prev: undefined,
				self: undefined,
				next: undefined,
				last: undefined,
			},
		);
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		return this.dataTransferObjectService.wallet(
			(
				await this.#post("account_info", [
					{
						account: id.value,
						strict: true,
						ledger_index: "current",
					},
				])
			).account_data,
		);
	}

	public override async broadcast(
		transactions: Contracts.SignedTransactionData[],
	): Promise<Services.BroadcastResponse> {
		const result: Services.BroadcastResponse = {
			accepted: [],
			rejected: [],
			errors: {},
		};

		for (const transaction of transactions) {
			const { engine_result, tx_json } = await this.#post("submit", [
				{
					tx_blob: transaction.toBroadcast(),
				},
			]);

			const transactionId: string = tx_json.hash;

			transaction.setAttributes({ identifier: transactionId });

			if (engine_result === "tesSUCCESS") {
				result.accepted.push(transactionId);
			} else {
				result.rejected.push(transactionId);

				result.errors[transactionId] = engine_result;
			}
		}

		return result;
	}

	async #post(method: string, params: any[]): Promise<Contracts.KeyValuePair> {
		return (
			await this.httpClient.post(this.hostSelector(this.configRepository).host, {
				jsonrpc: "2.0",
				id: UUID.random(),
				method,
				params,
			})
		).json().result;
	}
}
