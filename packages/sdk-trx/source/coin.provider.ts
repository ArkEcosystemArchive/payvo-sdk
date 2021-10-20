import { IoC } from "@payvo/sdk";

export class ServiceProvider extends IoC.AbstractServiceProvider {
	public override async make(container: IoC.Container): Promise<void> {
		return this.compose(container);
	}

	protected override path(): string {
		return __dirname;
	}
}
