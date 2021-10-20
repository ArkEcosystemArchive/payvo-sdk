import { Coins, IoC } from "@payvo/sdk";

export class ServiceProvider extends IoC.AbstractServiceProvider {
	public async make(container: IoC.Container): Promise<void> {
		return this.compose(container);
	}
}
