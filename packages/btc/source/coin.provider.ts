import { IoC } from "@payvo/sdk";
import { BindingType } from "./constants.js";

import { AddressFactory } from "./address.factory";
import { MultiSignatureSigner } from "./multi-signature.signer";

export class ServiceProvider extends IoC.AbstractServiceProvider {
	public override async make(container: IoC.Container): Promise<void> {
		container.singleton(BindingType.AddressFactory, AddressFactory);
		container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);

		return this.compose(container);
	}
}
