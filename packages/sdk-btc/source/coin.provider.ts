import { IoC } from "@payvo/sdk";
import { BindingType } from "./constants";

import { AddressFactory } from "./address.factory";
import LedgerTransportNodeHID from "@ledgerhq/hw-transport-node-hid-singleton";

export class ServiceProvider extends IoC.AbstractServiceProvider {
	public override async make(container: IoC.Container): Promise<void> {
		container.singleton(BindingType.AddressFactory, AddressFactory);
		// @ts-ignore
		container.singleton(BindingType.LedgerTransport, LedgerTransportNodeHID.default);

		return this.compose(container);
	}

	protected override path(): string {
		return __dirname;
	}
}
