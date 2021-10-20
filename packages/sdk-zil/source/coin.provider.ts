import { Helpers, IoC } from "@payvo/sdk";
import { Zilliqa } from "@zilliqa-js/zilliqa";

import { BindingType } from "./constants";

export class ServiceProvider extends IoC.AbstractServiceProvider {
	public override async make(container: IoC.Container): Promise<void> {
		container.constant(BindingType.Zilliqa, new Zilliqa(Helpers.randomHostFromConfig(this.configRepository)));

		return this.compose(container);
	}
}
