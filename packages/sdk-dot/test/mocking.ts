import { Test } from "@payvo/sdk";
import { Request } from "@payvo/sdk-http-got";

import { manifest } from "../source/manifest";
import { schema } from "../source/coin.schema";

export const createService = <T = any>(service: any, network: string = "dot.mainnet", predicate?: Function): T => {
	return Test.createService({
		httpClient: new Request(),
		manifest: manifest.networks[network],
		predicate,
		schema,
		service,
	});
};

export const createServiceAsync = async <T = any>(
	service: any,
	network: string = "dot.mainnet",
	predicate?: Function,
): Promise<T> => {
	return Test.createServiceAsync({
		httpClient: new Request(),
		manifest: manifest.networks[network],
		predicate,
		schema,
		service,
	});
};
