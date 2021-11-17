import { Container } from "../ioc/index.js";
import { BindingType } from "../ioc/service-provider.contract";
import { CoinManifest, Network, NetworkManifest } from "../networks/index.js";
import { NetworkRepository } from "../networks/network-repository.js";
import { Coin } from "./coin.js";
import { ConfigKey, ConfigRepository } from "./config.js";
import { CoinBundle, CoinOptions } from "./contracts.js";
import { Manifest } from "./manifest.js";

export class CoinFactory {
    public static make(bundle: CoinBundle, options: CoinOptions): Coin {
        // Combine default and extension networks
        const networks: Record<string, NetworkManifest> = bundle.manifest.networks;

        if (options.networks) {
            for (const [key, value] of Object.entries(options.networks)) {
                if (networks[key] === undefined) {
                    networks[key] = value;
                } else {
                    networks[key] = { ...networks[key], ...value };
                }
            }
        }

        const networkRepository: NetworkRepository = new NetworkRepository(networks);

        // Store configuration
        const configRepository: ConfigRepository = new ConfigRepository(options);
        configRepository.set(ConfigKey.Network, networkRepository.get(options.network));

        // Prepare container and bindings
        const container = new Container();
        container.constant(BindingType.ConfigRepository, configRepository);
        container.constant(BindingType.Services, bundle.services);
        container.constant(BindingType.ServiceProvider, bundle.serviceProvider);
        container.constant(BindingType.DataTransferObjects, bundle.dataTransferObjects);
        container.constant(BindingType.Container, container);
        container.constant(BindingType.HttpClient, options.httpClient);
        container.constant(BindingType.LedgerTransportFactory, options.ledgerTransportFactory);
        container.constant(BindingType.Manifest, new Manifest(bundle.manifest));
        container.constant(BindingType.Network, CoinFactory.#createNetwork(bundle.manifest, configRepository));
        container.constant(BindingType.NetworkRepository, networkRepository);
        container.constant(BindingType.Specification, bundle);

        // @TODO: use container to resolve this and inject values
        return new Coin(container);
    }

    static #createNetwork(manifest: CoinManifest, configRepository: ConfigRepository): Network {
        const network: NetworkManifest = configRepository.get<NetworkManifest>(ConfigKey.Network);

        return new Network(manifest, {
            ...manifest.networks[network.id],
            ...network,
        });
    }
}
