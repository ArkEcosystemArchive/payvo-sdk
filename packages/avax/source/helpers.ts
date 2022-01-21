import { Coins, Helpers, Services } from "@payvo/sdk";
import { BIP39, BIP44, HDKey } from "@payvo/sdk-cryptography";
import { Avalanche, BinTools, Buffer } from "avalanche";
import { AVMAPI, KeyPair } from "avalanche/dist/apis/avm/index.js";
import { InfoAPI } from "avalanche/dist/apis/info/index.js";
import { PlatformVMAPI } from "avalanche/dist/apis/platformvm/index.js";

export const useAvalanche = (config: Coins.ConfigRepository): Avalanche => {
	const host: string = Helpers.randomHostFromConfig(config);

	return new Avalanche(
		new URL(host).hostname,
		+host.split(":")[2],
		host.startsWith("https") ? "https" : "http",
		Number.parseInt(config.get("network.meta.networkId")),
		config.get("network.meta.blockchainId"),
	);
};

export const useInfo = (config: Coins.ConfigRepository): InfoAPI => useAvalanche(config).Info();

export const useXChain = (config: Coins.ConfigRepository): AVMAPI => useAvalanche(config).XChain();

export const usePChain = (config: Coins.ConfigRepository): PlatformVMAPI => useAvalanche(config).PChain();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useKeychain = (config: Coins.ConfigRepository) => useXChain(config).keyChain();

// eslint-disable-next-line unicorn/prevent-abbreviations
export const cb58Decode = (value: string): Buffer => BinTools.getInstance().cb58Decode(value);

// eslint-disable-next-line unicorn/prevent-abbreviations
export const cb58Encode = (value: Buffer): string => BinTools.getInstance().cb58Encode(value);

// Crypto
export const keyPairFromMnemonic = (
	config: Coins.ConfigRepository,
	mnemonic: string,
	options?: Services.IdentityOptions,
): { child: KeyPair; path: string } => {
	const path = BIP44.stringify({
		account: options?.bip44?.account,
		coinType: config.get(Coins.ConfigKey.Slip44),
		index: options?.bip44?.addressIndex,
	});

	return {
		child: useKeychain(config).importKey(
			// @ts-ignore
			HDKey.fromSeed(Buffer.from(BIP39.toSeed(mnemonic))).derive(path).privateKey,
		),
		path,
	};
};
