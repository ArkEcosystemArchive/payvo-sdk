import { IoC, Test } from "@payvo/sdk";
import { Request } from "@payvo/http-got";

import { BindingType } from "../source/coin.contract";
import { manifest } from "../source/manifest";
import { schema } from "../source/coin.schema";

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
				container.constant(
					BindingType.Crypto,
					(await require(`./fixtures/client/cryptoConfiguration.json`)).data,
				);
			}

			if (container.missing(BindingType.Height)) {
				container.constant(BindingType.Height, (await require(`./fixtures/client/syncing.json`)).data.height);
			}

			if (predicate) {
				predicate(container);
			}
		},
		schema,
		service,
	});
};

export const require = async (path: string): Promise<any> => (await import(path)).default;
