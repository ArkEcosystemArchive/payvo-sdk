import { IoC } from "@payvo/sdk";

import { Services } from "./coin.services";
import { TransactionService as TransactionServiceTwo } from "./transaction-two.service";
import { TransactionService as TransactionServiceThree } from "./transaction-three.service";
import { ClientService as ClientServiceTwo } from "./client-two.service";
import { ClientService as ClientServiceThree } from "./client-three.service";
import { isTest } from "./helpers";
import { BindingType } from "./coin.contract";
import { TransactionSerializer } from "./transaction.serializer";
import { AssetSerializer } from "./asset.serializer";

export class ServiceProvider extends IoC.AbstractServiceProvider implements IoC.IServiceProvider {
	public async make(container: IoC.Container): Promise<void> {
		if (isTest(this.configRepository)) {
			container.singleton(IoC.BindingType.ClientService, ClientServiceThree);
			container.singleton(IoC.BindingType.TransactionService, TransactionServiceThree);

			container.singleton(BindingType.AssetSerializer, AssetSerializer);
			container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
		} else {
			container.singleton(IoC.BindingType.ClientService, ClientServiceTwo);
			container.singleton(IoC.BindingType.TransactionService, TransactionServiceTwo);
		}

		return this.compose(Services, container);
	}
}
