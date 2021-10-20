import { IoC } from "@payvo/sdk";

import { BindingType } from "./coin.contract";
import { TransactionSerializer } from "./transaction.serializer";
import { AssetSerializer } from "./asset.serializer";

export class ServiceProvider extends IoC.AbstractServiceProvider implements IoC.IServiceProvider {
	public async make(container: IoC.Container): Promise<void> {
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);

		return this.compose(container);
	}
}
