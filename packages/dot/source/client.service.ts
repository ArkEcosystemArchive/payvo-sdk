import { Contracts, IoC, Services } from "@payvo/sdk";
import { ApiPromise } from "@polkadot/api";

import { BindingType } from "./constants.js";

@IoC.injectable()
export class ClientService extends Services.AbstractClientService {
	@IoC.inject(BindingType.ApiPromise)
	protected readonly client!: ApiPromise;

	@IoC.preDestroy()
	public async onPreDestroy(): Promise<void> {
		await this.client.disconnect();
	}

	public override async wallet(id: Services.WalletIdentifier): Promise<Contracts.WalletData> {
		const { data: balances, nonce } = await this.client.query.system.account(id.value);

		return this.dataTransferObjectService.wallet({
			address: id.value,
			balance: balances.free.toString(),
			nonce: nonce.toString(),
		});
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
				await this.client.rpc.author.submitExtrinsic(transaction.toBroadcast());

				result.accepted.push(transaction.id());
			} catch (error) {
				result.rejected.push(transaction.id());

				result.errors[transaction.id()] = (error as any).message;
			}
		}

		return result;
	}
}
