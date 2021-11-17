import { Test } from "@payvo/sdk";
import { Request } from "@payvo/sdk-http-fetch";
import { createRequire } from "module";
import { resolve } from "path";

import { manifest } from "../source/manifest";

export const createService = <T = any>(service: any, network: string = "ada.testnet", predicate?: Function): T => {
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

	return require(resolve(path));
};
