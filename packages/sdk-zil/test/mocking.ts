import { Test } from "@payvo/sdk";
import { Request } from "@payvo/http-got";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { createRequire } from "module";
import { resolve } from "path";

import { manifest } from "../source/manifest";

export const createService = <T = any>(service: any, network: string = "zil.testnet", predicate?: Function): T => {
	return Test.createService({
		httpClient: new Request(),
		manifest: manifest.networks[network],
		predicate,
		service,
	});
};

export const mockWallet = () => new Zilliqa("http://localhost:1234");

// @ts-ignore
export const requireModule = (path: string): any => {
	if (path.startsWith("../test")) {
		path = path.replace("../test", "./test");
	}

	// @ts-ignore
	return createRequire(import.meta.url)(resolve(path));
};
