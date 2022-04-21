import { Helpers, IoC } from "@payvo/sdk";

import { Identifiers } from "./container.models.js";
import { DataRepository } from "./data.repository.js";
import { DelegateService } from "./delegate.service.js";
import { EnvironmentOptions } from "./environment.models.js";
import { ExchangeRateService } from "./exchange-rate.service.js";
import { StorageFactory } from "./factory.storage.js";
import { FeeService } from "./fee.service.js";
import { KnownWalletService } from "./known-wallet.service.js";
import { PluginRegistry } from "./plugin-registry.service.js";
import { ProfileRepository } from "./profile.repository.js";
import { WalletService } from "./wallet.service.js";

export class DriverFactory {
	public static make(container: IoC.Container, options: EnvironmentOptions): void {
		if (typeof options.storage === "string") {
			container.constant(Identifiers.Storage, StorageFactory.make(options.storage));
		} else {
			container.constant(Identifiers.Storage, options.storage);
		}

		container.constant(Identifiers.LedgerTransportFactory, options.ledgerTransportFactory);
		container.constant(Identifiers.HttpClient, options.httpClient);
		container.constant(
			Identifiers.NetworkHostSelector,
			options.hostSelector ?? Helpers.randomNetworkHostFromConfig,
		);
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
