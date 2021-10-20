import { IoC } from "@payvo/sdk";

export class ServiceProvider extends IoC.AbstractServiceProvider {
	protected override path(): string {
		return __dirname;
	}
}
