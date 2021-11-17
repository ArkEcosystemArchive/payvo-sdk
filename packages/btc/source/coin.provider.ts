import { IoC } from "@payvo/sdk";
import { BindingType } from "./constants.js";

import { AddressFactory } from "./address.factory";

export class ServiceProvider extends IoC.AbstractServiceProvider {
	public override async make(container: IoC.Container): Promise<void> {
		container.singleton(BindingType.AddressFactory, AddressFactory);

		return this.compose(container);
	}
}
