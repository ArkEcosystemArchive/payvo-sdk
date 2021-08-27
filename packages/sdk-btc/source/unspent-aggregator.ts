import { Coins, Helpers, Http, IoC } from "@payvo/sdk";

import { UnspentTransaction } from "./contracts";

@IoC.injectable()
export class UnspentAggregator {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	private readonly configRepository!: Coins.ConfigRepository;

	@IoC.inject(IoC.BindingType.HttpClient)
	private readonly http!: Http.HttpClient;

	#peer!: string;

	@IoC.postConstruct()
	private onPostConstruct(): void {
		this.#peer = Helpers.randomHostFromConfig(this.configRepository);
	}

	public async aggregate(address: string): Promise<UnspentTransaction[]> {
		const response = (
			await this.http.post(`${this.#peer}/wallets/transactions/unspent`, {
				addresses: [address],
			})
		).json();

		return response.data;
	}
}
