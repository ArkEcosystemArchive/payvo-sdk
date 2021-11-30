import { configManager } from "../managers";

export const getWifFromNetwork = (): number => configManager.get("network.wif");
export const getPubKeyHashFromNetwork = (): number => configManager.get("network.pubKeyHash");

export const getPubKeyHash = (): number => configManager.get("network.pubKeyHash");
