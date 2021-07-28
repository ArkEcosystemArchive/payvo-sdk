import { IoC } from "@payvo/sdk";

import { Services } from "./coin.services";
import { BindingType } from "./coin.contract";
import { TransactionSerializer } from "./transaction.serializer";
import { AssetSerializer } from "./asset.serializer";

export class ServiceProvider extends IoC.AbstractServiceProvider implements IoC.IServiceProvider {
	public async make(container: IoC.Container): Promise<void> {
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);

		return this.compose(Services, container);
	}
}
