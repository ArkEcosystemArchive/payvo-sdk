import { Coins, Helpers, IoC, Networks } from "@payvo/sdk";

import { Identifiers } from "./container.models.js";
import { DataRepository } from "./data.repository.js";
import { DelegateService } from "./delegate.service.js";
import { EnvironmentOptions } from "./environment.models.js";
import { ExchangeRateService } from "./exchange-rate.service.js";
import { StorageFactory } from "./factory.storage.js";
import { FeeService } from "./fee.service.js";
import { KnownWalletService } from "./known-wallet.service.js";
import { PluginRegistry } from "./plugin-registry.service.js";
import { IProfile } from "./profile.contract.js";
import { ProfileSetting } from "./profile.enum.contract.js";
import { ProfileRepository } from "./profile.repository.js";
import { WalletService } from "./wallet.service.js";

export const defaultHostSelector =
	(profile: IProfile) => (configRepository: Coins.ConfigRepository, type?: Networks.NetworkHostType) => {
		type ??= "full";

		const defaultHosts = Helpers.filterHostsFromConfig(configRepository, type);
		const customHosts = profile
			.hosts()
			.allByNetwork(configRepository.get("network.id"))
			.map(({ host }) => host)
			.filter(({ custom, enabled }) => custom && enabled);

		if (customHosts.length === 0) {
			return Helpers.randomHost(defaultHosts, type);
		}

		if (profile.settings().get(ProfileSetting.FallbackToDefaultNodes)) {
			const customHost = Helpers.randomHost(customHosts, type);

			if (!customHost.failedCount || customHost.failedCount < 3) {
				return customHost;
			}

			return Helpers.randomHost(
				defaultHosts.filter(({ custom }) => !custom),
				type,
			);
		}

		return Helpers.randomHost(customHosts, type);
	};

export class DriverFactory {
	public static make(container: IoC.Container, options: EnvironmentOptions): void {
		if (typeof options.storage === "string") {
			container.constant(Identifiers.Storage, StorageFactory.make(options.storage));
		} else {
			container.constant(Identifiers.Storage, options.storage);
		}

		if (typeof options.hostSelector === "function") {
			container.constant(Identifiers.NetworkHostSelectorFactory, options.hostSelector);
		} else {
			container.constant(Identifiers.NetworkHostSelectorFactory, defaultHostSelector);
		}

		container.constant(Identifiers.LedgerTransportFactory, options.ledgerTransportFactory);
		container.constant(Identifiers.HttpClient, options.httpClient);
		container.constant(Identifiers.Coins, options.coins);

		container.singleton(Identifiers.AppData, DataRepository);
		container.singleton(Identifiers.DelegateService, DelegateService);
		container.singleton(Identifiers.ExchangeRateService, ExchangeRateService);
		container.singleton(Identifiers.FeeService, FeeService);
		container.singleton(Identifiers.KnownWalletService, KnownWalletService);
		container.singleton(Identifiers.PluginRegistry, PluginRegistry);
		container.singleton(Identifiers.ProfileRepository, ProfileRepository);
		container.singleton(Identifiers.WalletService, WalletService);
	}
}
