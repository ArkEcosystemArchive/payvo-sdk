import { Test } from "@payvo/sdk";
import { Request } from "@payvo/sdk-http-fetch";

import { manifest } from "../source/manifest";

export const createService = <T = any>(service: any, network: string = "btc.livenet", predicate?: Function): T => {
	return Test.createService({
		httpClient: new Request(),
		manifest: manifest.networks[network],
		predicate,
		service,
	});
};

export const createServiceAsync = <T = any>(
	service: any,
	network: string = "btc.livenet",
	predicate?: Function,
): Promise<T> => {
	return Test.createServiceAsync({
		httpClient: new Request(),
		manifest: manifest.networks[network],
		predicate,
		service,
	});
};
