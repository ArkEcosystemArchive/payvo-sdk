import { Contracts, Exceptions, IoC, Services } from "@payvo/sdk";
import { Connection, PublicKey } from "@solana/web3.js";

export class ClientService extends Services.AbstractClientService {
	#client!: Connection;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#client = new Connection(this.#host());
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		const response = await this.#client.getAccountInfo(new PublicKey(id.value));

		if (!response) {
			throw new Exceptions.Exception("Received an invalid response.");
		}

		return this.dataTransferObjectService.wallet({
			address: id,
			balance: response.lamports,
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
				const hash: string = await this.#client.sendEncodedTransaction(transaction.toBroadcast());

				transaction.setAttributes({ identifier: hash });

				result.accepted.push(transaction.id());
			} catch (error) {
				result.rejected.push(transaction.id());

				result.errors[transaction.id()] = (error as any).message;
			}
		}

		return result;
	}

	#host(): string {
		return this.hostSelector(this.configRepository).host;
	}
}
