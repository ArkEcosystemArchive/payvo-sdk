import { Coins, IoC } from "@payvo/sdk";
import { waitReady } from "@polkadot/wasm-crypto";

import { BindingType } from "./constants";
import { createApiPromise, createKeyring } from "./factories";


export class ServiceProvider extends IoC.AbstractServiceProvider implements IoC.IServiceProvider {
	public async make(container: IoC.Container): Promise<void> {
		await waitReady();

		container.constant(BindingType.ApiPromise, await createApiPromise(this.configRepository));
		container.constant(BindingType.Keyring, createKeyring(this.configRepository));

		return this.compose(container);
	}
}
