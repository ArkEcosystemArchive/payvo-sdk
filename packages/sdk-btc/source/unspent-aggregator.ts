import { IoC, Services } from "@payvo/sdk";

import { UnspentTransaction } from "./contracts";
import { ClientService } from "./client.service";

@IoC.injectable()
export class UnspentAggregator {
	@IoC.inject(IoC.BindingType.ClientService)
	private readonly clientService!: ClientService;

	public async aggregate(id: Services.WalletIdentifier): Promise<UnspentTransaction[]> {
		return await this.clientService.unspentTransactionOutputs(id);
	}
}
