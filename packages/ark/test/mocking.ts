import { IoC, Test } from "@payvo/sdk";
import { Request } from "@payvo/sdk-http-fetch";
import { createRequire } from "module";
import { resolve } from "path";

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
                container.constant(
                    BindingType.Crypto,
                    requireModule(`./test/fixtures/client/cryptoConfiguration.json`).data,
                );
            }

            if (container.missing(BindingType.Height)) {
                container.constant(
                    BindingType.Height,
                    requireModule(`./test/fixtures/client/syncing.json`).data.height,
                );
            }

            if (predicate) {
                predicate(container);
            }
        },
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
