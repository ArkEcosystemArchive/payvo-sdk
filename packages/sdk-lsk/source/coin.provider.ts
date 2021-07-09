import { Coins, IoC } from "@payvo/sdk";

import { BindingType } from "./coin.contract";
import { Services } from "./coin.services";
import { TransactionServiceTwo } from "./transaction-two.service";
import { TransactionServiceThree } from "./transaction-three.service";

export class ServiceProvider extends IoC.AbstractServiceProvider implements IoC.IServiceProvider {
	public async make(container: IoC.Container): Promise<void> {
		if (container.missing(BindingType.TransactionServiceTwo)) {
			container.singleton(BindingType.TransactionServiceTwo, TransactionServiceTwo);
		}

		if (container.missing(BindingType.TransactionServiceThree)) {
			container.singleton(BindingType.TransactionServiceThree, TransactionServiceThree);
		}

		return this.compose(Services, container);
	}
}
