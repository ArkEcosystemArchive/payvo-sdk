import { IoC } from "@payvo/sdk";
import { BindingType } from "./constants";

import { Services } from "./coin.services";
import { AddressFactory } from "./address.factory";
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";

export class ServiceProvider extends IoC.AbstractServiceProvider implements IoC.IServiceProvider {
	public async make(container: IoC.Container): Promise<void> {
		container.singleton(BindingType.AddressFactory, AddressFactory);
		// @ts-ignore
		container.singleton(BindingType.LedgerTransport, LedgerTransportNodeHID.default);

		return this.compose(Services, container);
	}
}
