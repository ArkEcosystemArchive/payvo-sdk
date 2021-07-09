import { Coins } from "@payvo/sdk";

export const isTest = (configRepository: Coins.ConfigRepository): boolean => configRepository.get(Coins.ConfigKey.NetworkType) === "test";
