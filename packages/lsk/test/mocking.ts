import { Test } from "@payvo/sdk";
import { Request } from "@payvo/sdk-http-fetch";
import { resolve } from "path";

import { manifest } from "../source/manifest";

export const createService = <T = any>(service: any, network: string = "lsk.testnet", predicate?: Function): T => {
	return Test.createService({
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
	return require(resolve(path));
};
