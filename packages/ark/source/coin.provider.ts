import { Managers } from "./crypto/index.js";
import { Coins, Helpers, Http, IoC } from "@payvo/sdk";

import { BindingType } from "./coin.contract.js";
import { MultiSignatureSigner } from "./multi-signature.signer.js";

@IoC.injectable()
export class ServiceProvider extends IoC.AbstractServiceProvider {
	public override async make(container: IoC.Container): Promise<void> {
		await this.#retrieveNetworkConfiguration(container);

		if (container.missing(BindingType.MultiSignatureSigner)) {
			container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
		}

		return this.compose(container);
	}

	async #retrieveNetworkConfiguration(container: IoC.Container): Promise<void> {
		const http: Http.HttpClient = container.get<Http.HttpClient>(IoC.BindingType.HttpClient);

		let peer: string = Helpers.randomHostFromConfig(this.configRepository);

		const [crypto, status] = await Promise.all([
			http.get(`${peer}/node/configuration/crypto`),
			http.get(`${peer}/node/syncing`),
		]);

		const dataCrypto = crypto.json().data;
		const { height } = status.json().data;

		if (dataCrypto.network.client.token !== this.configRepository.get(Coins.ConfigKey.CurrencyTicker)) {
			throw new Error(`Failed to connect to ${peer} because it is on another network.`);
		}

		Managers.configManager.setConfig(dataCrypto);
		Managers.configManager.setHeight(height);

		if (container.missing(BindingType.Crypto)) {
			container.constant(BindingType.Crypto, dataCrypto);
		}

		if (container.missing(BindingType.Height)) {
			container.constant(BindingType.Height, height);
		}
	}
}
