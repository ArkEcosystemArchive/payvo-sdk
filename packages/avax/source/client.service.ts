import { Collections, Contracts, Helpers, IoC, Services } from "@payvo/sdk";
import { uniq } from "@payvo/sdk-helpers";
import { AVMAPI, Tx } from "avalanche/dist/apis/avm";
import { PlatformVMAPI } from "avalanche/dist/apis/platformvm";

import { cb58Decode, usePChain, useXChain } from "./helpers";
import { WalletIdentifier } from "@payvo/sdk/distribution/services";

@IoC.injectable()
export class ClientService extends Services.AbstractClientService {
	#xchain!: AVMAPI;
	#pchain!: PlatformVMAPI;

	public override async transaction(
		id: string,
		input?: Services.TransactionDetailInput,
	): Promise<Contracts.ConfirmedTransactionData> {
		const transaction = new Tx();
		transaction.fromString(await this.#xchain.getTx(id));

		const unsignedTransaction = transaction.getUnsignedTx();
		const baseTransaction = unsignedTransaction.getTransaction();

		const assetId = cb58Decode(this.configRepository.get("network.meta.assetId"));

		return this.dataTransferObjectService.transaction({
			id,
			amount: unsignedTransaction.getOutputTotal(assetId).toString(),
			fee: unsignedTransaction.getBurn(assetId).toString(),
			memo: baseTransaction.getMemo().toString("utf-8"),
		});
	}

	public override async transactions(
		query: Services.ClientTransactionsInput,
	): Promise<Collections.ConfirmedTransactionDataCollection> {
		const identifier: WalletIdentifier = query.identifiers![0];

		const { transactions } = await this.#get("v2/transactions", {
			chainID: this.configRepository.get("network.meta.blockchainId"),
			limit: 100,
			offset: query.cursor || 0,
			address: identifier.value,
		});

		for (const transaction of transactions) {
			transaction.__identifier__ = identifier.value;
		}

		return this.dataTransferObjectService.transactions(transactions, {
			prev: undefined,
			self: undefined,
			next: undefined,
			last: undefined,
		});
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		const { balance }: any = await this.#xchain.getBalance(
			id.value,
			this.configRepository.get("network.meta.assetId"),
		);

		return this.dataTransferObjectService.wallet({
			address: id,
			balance: balance,
		});
	}

	public override async delegates(query?: Contracts.KeyValuePair): Promise<Collections.WalletDataCollection> {
		const validators: string[] = await this.#pchain.sampleValidators(10000);

		return new Collections.WalletDataCollection(
			uniq(validators).map((validator: string) =>
				this.dataTransferObjectService.wallet({ address: validator, balance: 0 }),
			),
			{
				prev: undefined,
				self: undefined,
				next: undefined,
				last: undefined,
			},
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
			try {
				const hash: string = await this.#xchain.issueTx(transaction.toBroadcast());

				transaction.setAttributes({ identifier: hash });

				result.accepted.push(hash);
			} catch (error) {
				result.rejected.push(transaction.id());

				result.errors[transaction.id()] = (error as any).message;
			}
		}

		return result;
	}

	async #get(path: string, query?: Contracts.KeyValuePair): Promise<Contracts.KeyValuePair> {
		return (await this.httpClient.get(`${this.#host()}/${path}`, query)).json();
	}

	#host(): string {
		return Helpers.randomHostFromConfig(this.configRepository, "archival");
	}

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#xchain = useXChain(this.configRepository);
		this.#pchain = usePChain(this.configRepository);
	}
}
