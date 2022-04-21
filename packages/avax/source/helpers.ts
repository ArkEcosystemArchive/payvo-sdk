import { Coins, Networks, Services } from "@payvo/sdk";
import { BIP39, BIP44, HDKey } from "@payvo/sdk-cryptography";
import { Avalanche, BinTools, Buffer } from "avalanche";
import { AVMAPI, KeyPair } from "avalanche/dist/apis/avm/index.js";
import { InfoAPI } from "avalanche/dist/apis/info/index.js";
import { PlatformVMAPI } from "avalanche/dist/apis/platformvm/index.js";

export const useAvalanche = (config: Coins.ConfigRepository, hostSelector: Networks.NetworkHostSelector): Avalanche => {
	const { host } = hostSelector(config);

	return new Avalanche(
		new URL(host).hostname,
		+host.split(":")[2],
		host.startsWith("https") ? "https" : "http",
		Number.parseInt(config.get("network.meta.networkId")),
		config.get("network.meta.blockchainId"),
	);
};

export const useInfo = (config: Coins.ConfigRepository, hostSelector: Networks.NetworkHostSelector): InfoAPI =>
	useAvalanche(config, hostSelector).Info();

export const useXChain = (config: Coins.ConfigRepository, hostSelector: Networks.NetworkHostSelector): AVMAPI =>
	useAvalanche(config, hostSelector).XChain();

export const usePChain = (config: Coins.ConfigRepository, hostSelector: Networks.NetworkHostSelector): PlatformVMAPI =>
	useAvalanche(config, hostSelector).PChain();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useKeychain = (config: Coins.ConfigRepository, hostSelector: Networks.NetworkHostSelector) =>
	useXChain(config, hostSelector).keyChain();

// eslint-disable-next-line unicorn/prevent-abbreviations
export const cb58Decode = (value: string): Buffer => BinTools.getInstance().cb58Decode(value);

// eslint-disable-next-line unicorn/prevent-abbreviations
export const cb58Encode = (value: Buffer): string => BinTools.getInstance().cb58Encode(value);

// Crypto
export const keyPairFromMnemonic = (
	config: Coins.ConfigRepository,
	hostSelector: Networks.NetworkHostSelector,
	mnemonic: string,
	options?: Services.IdentityOptions,
): { child: KeyPair; path: string } => {
	const path = BIP44.stringify({
		account: options?.bip44?.account,
		coinType: config.get(Coins.ConfigKey.Slip44),
		index: options?.bip44?.addressIndex,
	});

	return {
		child: useKeychain(config, hostSelector).importKey(
			// @ts-ignore
			HDKey.fromSeed(Buffer.from(BIP39.toSeed(mnemonic))).derive(path).privateKey,
		),
		path,
	};
};
