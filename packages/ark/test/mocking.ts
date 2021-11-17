import { IoC, Test } from "@payvo/sdk";
import { Request } from "@payvo/sdk-http-fetch";

import { BindingType } from "../source/coin.contract";
import { manifest } from "../source/manifest";

export const createService = async <T = any>(
	service: any,
	network: string = "ark.devnet",
	predicate?: Function,
): Promise<T> => {
	return Test.createServiceAsync({
		httpClient: new Request(),
		manifest: manifest.networks[network],
		predicate: async (container: IoC.Container) => {
			if (container.missing(BindingType.Crypto)) {
				container.constant(BindingType.Crypto, require("./fixtures/client/cryptoConfiguration.json").data);
			}

			if (container.missing(BindingType.Height)) {
				container.constant(BindingType.Height, require("./fixtures/client/syncing.json").data.height);
			}

			if (predicate) {
				predicate(container);
			}
		},
		service,
	});
};
