import { Coins, IoC } from "@payvo/sdk";
import { BindingType } from "./constants";

import { Services } from "./coin.services";
import { AddressFactory } from "./address.factory";
import { UnspentAggregator } from "./unspent-aggregator";

export class ServiceProvider extends IoC.AbstractServiceProvider implements IoC.IServiceProvider {
	public async make(container: IoC.Container): Promise<void> {
		container.singleton(BindingType.AddressFactory, AddressFactory);
		container.singleton(BindingType.UnspentAggregator, UnspentAggregator);

		return this.compose(Services, container);
	}
}
