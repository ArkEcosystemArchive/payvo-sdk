import { Coins, IoC } from "@payvo/sdk";


export class ServiceProvider extends IoC.AbstractServiceProvider implements IoC.IServiceProvider {
	public async make(container: IoC.Container): Promise<void> {
		return this.compose(container);
	}
}
