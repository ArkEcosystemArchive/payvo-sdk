import { IoC, Networks } from "@payvo/sdk";
import { Zilliqa } from "@zilliqa-js/zilliqa";

import { BindingType } from "./constants.js";

export class ServiceProvider extends IoC.AbstractServiceProvider {
	public override async make(container: IoC.Container): Promise<void> {
		const { host } = container.get<Networks.NetworkHostSelector>(IoC.BindingType.NetworkHostSelector)(
			this.configRepository,
		);

		container.constant(BindingType.Zilliqa, new Zilliqa(host));

		return this.compose(container);
	}
}
