/* istanbul ignore file */

import { v4 } from "uuid";

import { ConfigKey, ConfigRepository } from "./coins.js";
import { randomNetworkHostFromConfig } from "./helpers.js";
import { BindingType, Container } from "./ioc.js";
import { NetworkManifest } from "./networks.js";
import { BigNumberService } from "./services.js";

const createContainer = ({
	config,
	httpClient,
	manifest,
	meta,
}: {
	config?: ConfigRepository;
	httpClient: any;
	manifest: NetworkManifest;
	meta?: any;
}): Container => {
	config ??= new ConfigRepository({ httpClient, network: manifest.id });

	config.set(ConfigKey.Network, manifest);

	if (meta) {
		for (const [key, value] of Object.entries(meta)) {
			config.set(key, value);
		}
	}

	const container = new Container();
	container.constant(BindingType.ConfigRepository, config);
	container.constant(BindingType.HttpClient, httpClient);
	container.constant(BindingType.NetworkHostSelector, randomNetworkHostFromConfig);
	container.singleton(BindingType.BigNumberService, BigNumberService);

	return container;
};

export const createService = <T = any>({
	config,
	httpClient,
	manifest,
	meta,
	predicate,
	service,
}: {
	config?: ConfigRepository;
	httpClient: any;
	manifest: NetworkManifest;
	meta?: any;
	predicate: any;
	service: any;
}): T => {
	const container = createContainer({
		config,
		httpClient,
		manifest,
		meta,
	});

	if (predicate) {
		predicate(container);
	}

	const uuid: string = v4();

	container.singleton(uuid, service);

	return container.get(uuid);
};

export const createServiceAsync = async <T = any>({
	config,
	httpClient,
	manifest,
	meta,
	predicate,
	service,
}: {
	config?: ConfigRepository;
	httpClient: any;
	manifest: NetworkManifest;
	meta?: any;
	predicate: any;
	service: any;
}): Promise<T> => {
	const container = createContainer({
		config,
		httpClient,
		manifest,
		meta,
	});

	if (predicate) {
		await predicate(container);
	}

	const uuid: string = v4();

	container.singleton(uuid, service);

	return container.get(uuid);
};
