import { ConfigRepository } from "./config.js";
import { IContainer } from "./container.contracts.js";
import { HttpClient } from "./http-contracts.js";
import { KnownWallet, KnownWalletService } from "./known-wallet.contract.js";
import { BindingType } from "./service-provider.contract.js";

export class AbstractKnownWalletService implements KnownWalletService {
	protected readonly configRepository: ConfigRepository;
	protected readonly httpClient: HttpClient;

	public constructor(container: IContainer) {
		this.configRepository = container.get(BindingType.ConfigRepository);
		this.httpClient = container.get(BindingType.HttpClient);
	}

	public async all(): Promise<KnownWallet[]> {
		return [];
	}
}
