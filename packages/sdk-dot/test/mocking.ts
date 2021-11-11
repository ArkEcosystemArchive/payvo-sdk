import { Test } from "@payvo/sdk";
import { Request } from "@payvo/http-fetch";
import { createRequire } from "module";
import { resolve } from "path";

import { manifest } from "../source/manifest";

export const createService = <T = any>(service: any, network: string = "dot.mainnet", predicate?: Function): T => {
	return Test.createService({
		httpClient: new Request(),
		manifest: manifest.networks[network],
		predicate,
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
		service,
	});
};

// @ts-ignore
export const requireModule = (path: string): any => {
	if (path.startsWith("../test")) {
		path = path.replace("../test", "./test");
	}

	// @ts-ignore
	return createRequire(import.meta.url)(resolve(path));
};
